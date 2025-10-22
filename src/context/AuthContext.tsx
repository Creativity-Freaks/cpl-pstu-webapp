/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isAdminEmail } from "@/config/auth";

export type Role = "admin" | "player";

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
  avatar?: string; // data URL or remote URL
  session?: string;
  playerType?: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper" | string;
  semester?: string;
  paymentMethod?: "Bkash" | "Nagad" | "Rocket" | "Cash" | "Bank" | string;
  transactionId?: string;
  paymentNumber?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (params: { email: string; password: string; name?: string }) => Promise<AuthUser>;
  register: (params: { name: string; email: string; password: string; avatar?: string; session?: string; playerType?: AuthUser["playerType"]; semester?: string; paymentMethod?: AuthUser["paymentMethod"]; transactionId?: string; paymentNumber?: string }) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "cpl_auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
    } catch (e) {
      // ignore parsing errors
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login: AuthContextType["login"] = useCallback(async ({ email, password, name }) => {
    // Mock auth: accept any email/password; assign role selected
    await new Promise((r) => setTimeout(r, 400));
    const derivedName = name || email.split("@")[0];
    const role: Role = isAdminEmail(email) ? "admin" : "player";
    const u: AuthUser = { name: derivedName, email, role };
    setUser(u);
    persist(u);
    return u;
  }, []);

  const register: AuthContextType["register"] = useCallback(async ({ name, email, password, avatar, session, playerType, semester, paymentMethod, transactionId, paymentNumber }) => {
    // Mock register: create a player user
    await new Promise((r) => setTimeout(r, 500));
    const u: AuthUser = { name, email, role: "player", avatar, session, playerType, semester, paymentMethod, transactionId, paymentNumber };
    setUser(u);
    persist(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const u: AuthUser = { ...prev, ...patch };
      persist(u);
      return u;
    });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, login, register, logout, updateUser }),
    [user, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
