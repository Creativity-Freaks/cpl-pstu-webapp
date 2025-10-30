import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchDepartments } from "@/data/teams";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Trophy } from "lucide-react";

const TeamDepartmentPage = () => {
  interface TeamRow {
    id: string;
    name: string;
    short_name: string;
    description?: string;
    color?: string;
    logo_url?: string;
    captain?: string | null;
    achievements?: string[] | null;
  }

  interface Member {
    profile_id: string;
    role: string;
    profiles: {
      name: string;
      avatar_url: string | null;
      session: string | null;
    } | null;
  }
  const { dept } = useParams<{ dept: string }>();
  const [data, setData] = useState<{
    name: string;
    short_name: string;
    description: string;
    color: string;
    logo_url: string;
    captain: string | null;
    achievements: string[] | null;
    players: {
      id: string;
      name: string;
      avatar: string | null;
      session: string | null;
      role: string;
    }[];
  } | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        if (!supabase) return;

        // 1) fetch team row by short_name
        // Log for debugging
        console.log('TeamDepartment: dept param:', dept);
        const { data: teamRows, error: tErr } = await supabase
          .from("teams")
          .select("id, name, short_name, description, color, logo_url")
          .eq("short_name", dept)
          .limit(1)
          .maybeSingle();
        // Log both result and any Supabase error for better debugging
        console.log('TeamDepartment: Supabase result:', teamRows, 'error:', tErr);
        if (tErr) {
          console.error('TeamDepartment: Supabase error fetching team:', tErr);
          // Try a safe local fallback from src/data/teams
          try {
            const deps = await fetchDepartments();
            const found = deps.find((d) => String(d.short).toLowerCase() === String(dept || '').toLowerCase());
            if (found) {
              setData({
                name: found.name,
                short_name: found.short,
                description: found.description || '',
                color: found.color || '#000',
                logo_url: found.logo_url || '',
                captain: null,
                achievements: [],
                players: (found.players || []).map((p) => ({ id: p.id, name: p.name, avatar: p.avatar || null, session: p.session || null, role: p.role })),
              });
              return;
            }
          } catch (e) {
            console.error('TeamDepartment: local fallback failed:', e);
          }
          setData(null);
          return;
        }
        if (!teamRows) {
          // If no row returned from Supabase, try local fallback too
          try {
            const deps = await fetchDepartments();
            const found = deps.find((d) => String(d.short).toLowerCase() === String(dept || '').toLowerCase());
            if (found) {
              setData({
                name: found.name,
                short_name: found.short,
                description: found.description || '',
                color: found.color || '#000',
                logo_url: found.logo_url || '',
                captain: null,
                achievements: [],
                players: (found.players || []).map((p) => ({ id: p.id, name: p.name, avatar: p.avatar || null, session: p.session || null, role: p.role })),
              });
              return;
            }
          } catch (e) {
            console.error('TeamDepartment: local fallback failed:', e);
          }
          setData(null);
          return;
        }

  const team = teamRows as TeamRow;
  const teamId = team.id;

        // 2) fetch team members with profile info
        const { data: members, error: mErr } = await supabase
          .from("team_members")
          .select("profile_id, role, profiles(name, avatar_url, session)")
          .eq("team_id", teamId);

        if (mErr) throw mErr;

        const players = (members || []).map((m) => {
          // Supabase returns profiles as an object, not array
          const profile = m.profiles && !Array.isArray(m.profiles) ? m.profiles : null;
          return {
            id: String(m.profile_id),
            name: profile?.name || "Player",
            avatar: profile?.avatar_url || null,
            session: profile?.session || null,
            role: m.role || "Player",
          };
        });

        // If teams table doesn't have captain/achievements columns, derive captain from members
        const captainName = players.find((p) => (p.role || "").toLowerCase().includes("captain"))?.name || null;
        setData({
          name: team.name,
          short_name: team.short_name,
          description: team.description || "",
          color: team.color || "#000",
          logo_url: team.logo_url || "",
          captain: captainName,
          achievements: [],
          players,
        });
      } catch (err) {
        console.error("Error fetching team data:", err);
        setData(null);
      }
    };

    if (dept) fetchTeamData();
  }, [dept]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {!data ? (
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-3xl font-bold">Department not found</h1>
              <p className="text-muted-foreground">The team category you’re looking for doesn’t exist.</p>
              <Button asChild variant="outline">
                <Link to="/team"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Teams</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                      {data.short_name} <span className="text-accent">Team</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">{data.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="border-border">
                      <Link to="/team"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
                    </Button>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  <Card className="border-border animate-fade-in-up">
                    <CardContent className="p-6 flex items-center gap-3">
                      <Users className="h-6 w-6 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Players</p>
                        <p className="text-2xl font-bold">{data.players?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border animate-fade-in-up" style={{animationDelay: '0.05s'}}>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground">Captain</p>
                      <p className="text-lg font-semibold">{data.captain || 'TBD'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground">Achievements</p>
                      <p className="text-lg font-semibold flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> {data.achievements?.length || 0}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Players */}
                <h2 className="text-2xl font-bold mb-4">Player List</h2>
                {data.players?.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No players added yet. Player list will be shown here.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.players.map((p) => (
                      <Card key={p.id} className="border-border hover:shadow-glow transition-all">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={p.avatar || ""} alt={p.name} />
                              <AvatarFallback>{(p.name || "").slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link to={`/profile/${p.id}`} className="font-semibold hover:underline">
                                {p.name}
                              </Link>
                              <p className="text-xs text-muted-foreground">{p.session || "Session N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="px-2 py-1 rounded bg-accent/10 text-accent">{p.role}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamDepartmentPage;
