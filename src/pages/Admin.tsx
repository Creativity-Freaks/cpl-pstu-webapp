import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { Shield, Users, Trophy, Gavel, LogOut, PlusCircle, CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState<Array<{ id: string; name: string }>>([]);
  const [tournaments, setTournaments] = useState<Array<{ id: string; name: string }>>([]);
  const [profiles, setProfiles] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{ profile_id: string; name?: string; role?: string }>>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      try {
        const [t1, t2] = await Promise.all([
          supabase.from("teams").select("id,name,short_name").order("name"),
          supabase.from("tournaments").select("id,name").order("name"),
        ]);
        if (t1.data) setTeams(t1.data.map((t: { id: string; name: string; short_name?: string }) => ({ id: t.id, name: t.short_name || t.name })));
        if (t2.data) setTournaments(t2.data.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })));
      } catch {
        // Ignore errors
      }
      // fetch simple profiles list for assignment
      if (isSupabaseConfigured && supabase) {
        try {
          const r = await supabase.from('profiles').select('id, name').order('name');
          if (r.data) setProfiles(r.data.map((p: { id: string; name?: string; email?: string }) => ({ id: p.id, name: p.name || p.email || 'Player' })));
        } catch {
          // Ignore errors
        }
      }
    })();
  }, []);

  const [newTeam, setNewTeam] = useState({ name: "", short: "" });
  const createTeam = async () => {
    if (!isSupabaseConfigured) return toast.error("Supabase not configured");
    if (!newTeam.name.trim()) return toast.error("Enter team name");
    const { error } = await supabase.from("teams").insert({ name: newTeam.name, short_name: newTeam.short || null });
    if (error) return toast.error(error.message);
    toast.success("Team created");
    setNewTeam({ name: "", short: "" });
  };

  const [newMatch, setNewMatch] = useState<{ tournament_id: string; team_a: string; team_b: string; date: string; venue: string }>({ tournament_id: "", team_a: "", team_b: "", date: "", venue: "" });
  const scheduleMatch = async () => {
    if (!isSupabaseConfigured) return toast.error("Supabase not configured");
    const { tournament_id, team_a, team_b, date, venue } = newMatch;
    if (!tournament_id || !team_a || !team_b || !date) return toast.error("Fill all required fields");
    const { error } = await supabase.from("matches").insert({ tournament_id, team_a, team_b, match_date: new Date(date).toISOString(), venue, status: "upcoming" });
    if (error) return toast.error(error.message);
    toast.success("Match scheduled");
    setNewMatch({ tournament_id: "", team_a: "", team_b: "", date: "", venue: "" });
  };

  const loadTeamMembers = async (teamId: string | null) => {
    if (!isSupabaseConfigured || !supabase || !teamId) { setTeamMembers([]); return; }
    const { data, error } = await supabase.from('team_members').select('profile_id, role, profiles(name)').eq('team_id', teamId);
    if (error) return toast.error(error.message);
  setTeamMembers((data || []).map((m) => {
    const profile = m.profiles && !Array.isArray(m.profiles) ? m.profiles : null;
    return {
      profile_id: m.profile_id,
      name: profile?.name || 'Player',
      role: m.role,
    };
  }));
  };

  useEffect(() => { if (selectedTeam) loadTeamMembers(selectedTeam); else setTeamMembers([]); }, [selectedTeam]);

  const assignPlayer = async () => {
    if (!isSupabaseConfigured || !supabase) return toast.error('Supabase not configured');
    if (!selectedTeam || !selectedProfile) return toast.error('Select team and player');
    const { error } = await supabase.from('team_members').insert([{ team_id: selectedTeam, profile_id: selectedProfile, role: 'Player' }]);
    if (error) return toast.error(error.message);
    toast.success('Player assigned');
    loadTeamMembers(selectedTeam);
  };

  const removePlayer = async (profileId: string) => {
    if (!isSupabaseConfigured || !supabase) return toast.error('Supabase not configured');
    if (!selectedTeam) return toast.error('Select team first');
    const { error } = await supabase.from('team_members').delete().eq('team_id', selectedTeam).eq('profile_id', profileId);
    if (error) return toast.error(error.message);
    toast.success('Player removed');
    loadTeamMembers(selectedTeam);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-center animate-fade-in-up">
            Admin <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up">
            Welcome {user?.name}. Manage tournaments, teams, and auctions.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> Tournaments</CardTitle>
                <CardDescription>Create and manage tournaments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-gradient-accent">Manage Tournaments</Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5 text-accent" /> Quick Create Team</CardTitle>
                <CardDescription>{isSupabaseConfigured ? "Create a team (name & short)" : "Supabase not configured"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Team Name</Label>
                    <Input value={newTeam.name} onChange={(e) => setNewTeam((s) => ({ ...s, name: e.target.value }))} placeholder="e.g., CSIT" />
                  </div>
                  <div>
                    <Label>Short</Label>
                    <Input value={newTeam.short} onChange={(e) => setNewTeam((s) => ({ ...s, short: e.target.value }))} placeholder="e.g., CSIT" />
                  </div>
                </div>
                <Button disabled={!isSupabaseConfigured} onClick={createTeam} className="bg-gradient-accent">Create Team</Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Registrations</CardTitle>
                <CardDescription>Review player registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">View Registrations</Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Assign Players</CardTitle>
                <CardDescription>Assign / remove players to teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Team</Label>
                  <select className="w-full border rounded p-2 bg-background" value={selectedTeam || ""} onChange={(e) => setSelectedTeam(e.target.value || null)}>
                    <option value="">Select team...</option>
                    {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>
                <div>
                  <Label>Player</Label>
                  <select className="w-full border rounded p-2 bg-background" value={selectedProfile || ""} onChange={(e) => setSelectedProfile(e.target.value || null)}>
                    <option value="">Select player...</option>
                    {profiles.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={assignPlayer} disabled={!selectedTeam || !selectedProfile} className="bg-gradient-accent">Assign</Button>
                  <Button variant="outline" onClick={() => { if (selectedProfile) removePlayer(selectedProfile); }}>Remove</Button>
                </div>

                <div>
                  <Label>Current Members</Label>
                  {teamMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members assigned.</p>
                  ) : (
                    <ul className="space-y-2 mt-2">
                      {teamMembers.map((m) => (
                        <li key={m.profile_id} className="flex items-center justify-between">
                          <span>{m.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{m.role}</span>
                            <Button size="sm" variant="ghost" onClick={() => removePlayer(m.profile_id)}>Remove</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarPlus className="h-5 w-5 text-accent" /> Schedule Match</CardTitle>
                <CardDescription>{isSupabaseConfigured ? "Pick tournament & teams" : "Supabase not configured"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Tournament</Label>
                  <select className="w-full border rounded p-2 bg-background" value={newMatch.tournament_id} onChange={(e) => setNewMatch((s) => ({ ...s, tournament_id: e.target.value }))}>
                    <option value="">Select...</option>
                    {tournaments.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Team A</Label>
                    <select className="w-full border rounded p-2 bg-background" value={newMatch.team_a} onChange={(e) => setNewMatch((s) => ({ ...s, team_a: e.target.value }))}>
                      <option value="">Select...</option>
                      {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <Label>Team B</Label>
                    <select className="w-full border rounded p-2 bg-background" value={newMatch.team_b} onChange={(e) => setNewMatch((s) => ({ ...s, team_b: e.target.value }))}>
                      <option value="">Select...</option>
                      {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" value={newMatch.date} onChange={(e) => setNewMatch((s) => ({ ...s, date: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <Input value={newMatch.venue} onChange={(e) => setNewMatch((s) => ({ ...s, venue: e.target.value }))} placeholder="e.g., Main Ground" />
                  </div>
                </div>
                <Button disabled={!isSupabaseConfigured} onClick={scheduleMatch} className="bg-gradient-accent">Schedule</Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5 text-accent" /> Auction</CardTitle>
                <CardDescription>Hidden auction controls</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Link to="/admin/auction">
                  <Button className="bg-gradient-accent">Open Auction</Button>
                </Link>
                <span className="text-xs text-muted-foreground">(Only accessible by Admin)</span>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-accent" /> Account</CardTitle>
                <CardDescription>Admin session controls</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={logout} className="flex items-center gap-2"><LogOut className="h-4 w-4"/> Logout</Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Testimonials</CardTitle>
                <CardDescription>Manage player testimonials</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/testimonials">
                  <Button className="bg-gradient-accent">Manage Testimonials</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
