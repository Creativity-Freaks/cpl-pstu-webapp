import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Cpu, Radio, Wrench, Zap, Sigma } from "lucide-react";

const TeamPage = () => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    csit: Cpu,
    cce: Radio,
    pme: Wrench,
    eee: Zap,
    mathematics: Sigma,
  };

  const [items, setItems] = useState<{ id?: string; name: string; short_name: string; description?: string; color?: string; logo_url?: string }[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // We only want the fixed five department teams in a stable order
        const desired = ["CSIT", "CCE", "PME", "EEE", "Mathematics"];
        if (!supabase) {
          // fallback: create minimal placeholders
          setItems(desired.map((s) => ({ name: s, short_name: s })));
          return;
        }

        const { data: teams, error } = await supabase
          .from("teams")
          .select("id, name, short_name, description, color, logo_url")
          .in('short_name', desired);

        if (error) throw error;

        // Ensure stable order matching `desired`
        const found = (teams || []) as Array<Record<string, unknown>>;
        const ordered = desired.map((s) =>
          found.find((t) => String(t.short_name || t.name) === s) || { name: s, short_name: s }
        );
        setItems(ordered as { id?: string; name: string; short_name: string; description?: string; color?: string; logo_url?: string }[]);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-center animate-fade-in-up">
            Teams by <span className="text-accent">Department</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up">
            Explore department squads. Select a category to view details and player list.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((dept, index) => {
              const Icon = icons[dept.short_name.toLowerCase()] ?? Cpu;
              return (
                <Card
                  key={dept.name}
                  className="border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="h-2 bg-gradient-accent" style={{ backgroundColor: dept.color }} />
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-accent" />
                        <h3 className="text-xl font-bold text-foreground">{dept.short_name}</h3>
                      </div>
                      <Badge className="bg-primary-glow text-primary-foreground">CPL</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                    <div className="flex justify-between items-center">
                      <Button asChild size="sm" className="bg-gradient-accent shadow-accent">
                        <Link to={`/team/${dept.short_name}`}>View details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
