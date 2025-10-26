import React, { useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AuthContext, AuthContextValue, User, Credentials } from './auth-shared';

const STORAGE_USERS = "cpl_users";
const STORAGE_CURRENT = "cpl_current_user";
// Supabase-only auth (profiles table drives user metadata). If Supabase is not configured,
// methods will reject with an explanatory error.

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_CURRENT);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  type ProfileRow = {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    role?: string | null;
    session?: string | null;
    player_type?: string | null;
    semester?: string | null;
    payment_method?: string | null;
    payment_number?: string | null;
    transaction_id?: string | null;
  };

  const mapProfile = React.useCallback((p: ProfileRow): User => ({
    name: p.name || p.email || 'User',
    email: p.email || '',
    avatar: p.avatar_url || null,
    role: (p.role as string) || 'player',
    session: p.session || undefined,
    playerType: p.player_type || undefined,
    semester: p.semester || undefined,
    paymentMethod: p.payment_method || undefined,
    paymentNumber: p.payment_number || undefined,
    transactionId: p.transaction_id || undefined,
  }), []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Auth is disabled.");
      return;
    }

    type SupabaseSubscriptionShape = { data?: { subscription?: { unsubscribe?: () => void } }; unsubscribe?: () => void };
    let subscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        const userId = session.user.id;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (profile) persistCurrent(mapProfile(profile as ProfileRow));
      }

      subscription = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const userId = session.user.id;
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
          if (profile) persistCurrent(mapProfile(profile as ProfileRow));
        } else {
          persistCurrent(null);
        }
      });
    })();

    return () => {
      try {
        const s = subscription as unknown as SupabaseSubscriptionShape | null;
        if (s) {
          if (s.data?.subscription?.unsubscribe) s.data.subscription.unsubscribe();
          else if (typeof s.unsubscribe === 'function') s.unsubscribe();
        }
      } catch (err) {
        console.warn('Failed to unsubscribe auth listener', err);
      }
    };
  }, [mapProfile]);

  const persistCurrent = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_CURRENT, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_CURRENT);
  };

  // helper: upload a data-url image to the avatars bucket and return its public URL
  async function uploadAvatarForUser(userId: string, dataUrl: string) {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');
      const bucket = (import.meta.env.VITE_SUPABASE_BUCKET as string) || (import.meta.env.VITE_SUPABASE_AVATARS_BUCKET as string) || 'avatars';
      if (!dataUrl || !dataUrl.startsWith('data:')) return null;
      // convert dataURL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const ext = (blob.type && blob.type.split('/')[1]) || 'png';
      // Store objects under a user folder inside the bucket. The bucket name is
      // provided separately to supabase.storage.from(bucket) so the object key
      // should not repeat the bucket name. Use `<userId>/...` so storage policies
      // that check the object name prefix (auth.uid()) work correctly.
      // Ensure the current client session user id matches the intended userId.
      // Storage policies typically check auth.uid(), so the client must be
      // authenticated as the same user when uploading.
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUserId = sessionData?.session?.user?.id || null;
        if (!sessionUserId) throw new Error('Not authenticated');
        if (sessionUserId !== userId) {
          // Prefer to use the session user id for the object path to satisfy RLS
          // policies and avoid mismatches.
          userId = sessionUserId;
        }
      } catch (err) {
        console.warn('No active session while uploading avatar', err);
        throw new Error('Not authenticated');
      }

      const filename = `${userId}/${Date.now()}.${ext}`;
      // Convert Blob to File so Supabase SDK receives a File with a name/contentType
      const file = new File([blob], filename, { type: blob.type || 'image/png' });
      const { error: upErr } = await supabase.storage.from(bucket).upload(filename, file, { upsert: true });
      if (upErr) {
        console.error('Avatar upload failed', upErr.message || upErr);
        return null;
      }
      // Try to get a public URL first. If the bucket is private, return a signed URL.
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      if (urlData?.publicUrl) return urlData.publicUrl;
      // fallback: create a signed URL valid for 1 hour
      try {
        const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(filename, 60 * 60);
        if (signErr) {
          console.warn('createSignedUrl failed', signErr.message || signErr);
          return null;
        }
        return signed?.signedUrl || null;
      } catch (err) {
        console.warn('createSignedUrl unexpected error', err);
        return null;
      }
    } catch (err) {
      console.error('uploadAvatarForUser error', err);
      return null;
    }
  }

  const login = async ({ email, password }: Credentials) => {
    if (!isSupabaseConfigured || !supabase) return Promise.reject(new Error('Supabase not configured'));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return Promise.reject(error);
    const userId = data.user?.id;
    if (!userId) return Promise.reject(new Error('No user returned'));
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (pErr) return Promise.reject(pErr);
    if (!profile) return Promise.reject(new Error('Profile not found'));
    const u = mapProfile(profile);
    persistCurrent(u);
    return u;
  };

  const register = async ({ name, email, password, avatar, playerType, semester, paymentMethod, paymentNumber, transactionId, session }: { name: string; email: string; password: string; avatar?: string; playerType?: string; semester?: string; paymentMethod?: string; paymentNumber?: string; transactionId?: string; session?: string }) => {
    if (!isSupabaseConfigured || !supabase) return Promise.reject(new Error('Supabase not configured'));
    const role = email.includes('admin') ? 'admin' : 'player';
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, role } } });
    if (error) return Promise.reject(error);
    const udata = data.user;
    if (!udata) return Promise.reject(new Error('No user returned'));

    // Direct client-side flow: ensure session (try to sign in), upload avatar
    // using the authenticated client, then upsert the profile row directly.
    // This keeps the code simple and uses Supabase from the browser.
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUserId = sessionData?.session?.user?.id || null;
      if (!sessionUserId) {
        // attempt to sign in immediately with the provided credentials so the
        // client can upload to storage (policies often check auth.uid())
        try {
          const signin = await supabase.auth.signInWithPassword({ email, password });
          if (signin.error) console.warn('Auto sign-in after signUp failed', signin.error.message || signin.error);
        } catch (err) {
          console.warn('Auto sign-in after signUp unexpected error', err);
        }
      }
    } catch (err) {
      console.warn('Failed to ensure session after signUp', err);
    }

    // Now attempt client-side avatar upload and profile upsert.
    let avatarUrl: string | null = null;
    if (avatar && avatar.startsWith('data:')) {
      avatarUrl = await uploadAvatarForUser(udata.id, avatar);
      if (!avatarUrl) console.warn('Avatar upload failed');
    } else if (avatar) {
      avatarUrl = avatar;
    }

    const profile: Record<string, unknown> = {
      id: udata.id,
      name,
      email,
      role,
      avatar_url: avatarUrl || null,
      session: session || null,
    };
    if (playerType) profile.player_type = playerType;
    if (semester) profile.semester = semester;
    if (paymentMethod) profile.payment_method = paymentMethod;
    if (paymentNumber) profile.payment_number = paymentNumber;
    if (transactionId) profile.transaction_id = transactionId;

    const { data: upsertedProfile, error: pErr } = await supabase.from('profiles').upsert(profile).select('*').maybeSingle();
    if (pErr) {
      console.error('Failed to create/update profile:', pErr.message || pErr);
      return Promise.reject(pErr);
    }
    if (!upsertedProfile) return Promise.reject(new Error('Profile creation failed'));
    const u = mapProfile(upsertedProfile as ProfileRow);
    persistCurrent(u);
    return u;
  };

  const logout = async () => {
    if (!isSupabaseConfigured || !supabase) return persistCurrent(null);
    await supabase.auth.signOut();
    persistCurrent(null);
  };

  const updateUser = async (patch: Partial<User>) => {
    if (!isSupabaseConfigured || !supabase) return Promise.reject(new Error('Supabase not configured'));
    if (!user) return Promise.reject(new Error('Not authenticated'));
  const updates: Record<string, unknown> = {};
    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.avatar !== undefined) {
      // if avatar is a data-url, upload it
      if (typeof patch.avatar === 'string' && patch.avatar.startsWith('data:')) {
        // Require an active session user for uploads; storage policies use auth.uid()
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUserId = sessionData?.session?.user?.id || null;
        if (!sessionUserId) return Promise.reject(new Error('Not authenticated'));
        const uploaded = await uploadAvatarForUser(sessionUserId, patch.avatar as string);
        if (uploaded) updates.avatar_url = uploaded;
        else return Promise.reject(new Error('Avatar upload failed'));
      } else {
        updates.avatar_url = patch.avatar;
      }
    }
    if (patch.playerType !== undefined) updates.player_type = patch.playerType;
    if (patch.semester !== undefined) updates.semester = patch.semester;
    if (patch.paymentMethod !== undefined) updates.payment_method = patch.paymentMethod;
    if (patch.paymentNumber !== undefined) updates.payment_number = patch.paymentNumber;
    if (patch.transactionId !== undefined) updates.transaction_id = patch.transactionId;
  const patchWithSession = patch as Partial<User & { session?: string }>;
  if (patchWithSession.session !== undefined) updates.session = patchWithSession.session;

    // update profiles table
  const profileId = user.email ? (await getProfileIdByEmail(user.email)) : null;
    if (!profileId) return Promise.reject(new Error('Profile not found'));
    const { error } = await supabase.from('profiles').update(updates).eq('id', profileId);
    if (error) return Promise.reject(error);
    // refresh profile
    const { data: refreshed } = await supabase.from('profiles').select('*').eq('email', user.email).maybeSingle();
    if (refreshed) persistCurrent(mapProfile(refreshed));
    return;
  };

  async function getProfileIdByEmail(email: string) {
    const { data } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
    return data?.id || null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
  );
};

// hook exported from a separate module to avoid fast-refresh warnings
