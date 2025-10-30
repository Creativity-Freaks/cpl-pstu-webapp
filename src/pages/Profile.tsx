import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id || !supabase) return setLoading(false);
      try {
        const { data, error } = await supabase.from("profiles").select("id, name, email, avatar_url, role, session, player_type, semester, payment_method, payment_number, transaction_id, created_at").eq("id", id).maybeSingle();
        if (error) throw error;
        setProfile(data || null);
      } catch (e) {
        console.error("Error loading profile:", e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!profile) return <p className="p-8">Profile not found.</p>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <img src={profile.avatar_url || "/src/assets/default-avatar.png"} alt={profile.name} className="mx-auto rounded-full h-36 w-36 object-cover mb-4" />
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>

          <div className="prose prose-invert">
            <h2>Details</h2>
            <p><strong>Role:</strong> {profile.role || "player"}</p>
            <p><strong>Session:</strong> {profile.session || "N/A"}</p>
            <p><strong>Player Type:</strong> {profile.player_type || "N/A"}</p>
            <p><strong>Semester:</strong> {profile.semester || "N/A"}</p>
            <h3>Payment</h3>
            <p><strong>Method:</strong> {profile.payment_method || "-"}</p>
            <p><strong>Number:</strong> {profile.payment_number || "-"}</p>
            <p><strong>Transaction ID:</strong> {profile.transaction_id || "-"}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
