import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TeamPage = () => {
  const teams = [
    { name: "Code Warriors", captain: "Md. Rakib Hasan", status: "Active", wins: 8, losses: 2 },
    { name: "Debug Dynamos", captain: "Sadia Akter", status: "Active", wins: 7, losses: 3 },
    { name: "Binary Blazers", captain: "Fahim Ahmed", status: "Active", wins: 6, losses: 4 },
    { name: "Algorithm Aces", captain: "Nusrat Jahan", status: "Active", wins: 6, losses: 4 },
    { name: "Stack Strikers", captain: "Mehedi Hasan", status: "Active", wins: 5, losses: 5 },
    { name: "Loop Legends", captain: "Tahmina Akter", status: "Active", wins: 5, losses: 5 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-center animate-fade-in-up">
            Participating <span className="text-accent">Teams</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up">
            Meet the teams competing in CPL 2026
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <Card 
                key={index} 
                className="border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-2 bg-gradient-accent"></div>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                    <Badge className="bg-primary-glow text-primary-foreground">{team.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Captain:</span> {team.captain}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">{team.wins}</p>
                        <p className="text-xs text-muted-foreground">Wins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-muted-foreground">{team.losses}</p>
                        <p className="text-xs text-muted-foreground">Losses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{((team.wins / (team.wins + team.losses)) * 100).toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
