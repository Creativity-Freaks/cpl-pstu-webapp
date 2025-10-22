import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Trophy, Medal, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TournamentPage = () => {
  const currentTournaments = [
    {
      title: "CPL 2026 - League Stage",
      description: "The main championship is currently underway",
      date: "December 1 - December 12, 2026",
      teams: "20 Teams",
      venue: "PSTU Cricket Ground",
      status: "Live",
      statusColor: "bg-red-500 animate-pulse",
    },
  ];

  const upcomingTournaments = [
    {
      title: "CPL 2027 - Main Tournament",
      description: "Next season's flagship championship",
      date: "December 2027",
      teams: "24 Teams",
      venue: "PSTU Cricket Ground",
      status: "Coming Soon",
      statusColor: "bg-accent",
    },
    {
      title: "Inter-Department T20 Cup",
      description: "Quick format tournament between departments",
      date: "February 2027",
      teams: "16 Teams",
      venue: "PSTU Cricket Ground",
      status: "Registration Opens Soon",
      statusColor: "bg-primary-glow",
    },
  ];

  const pastTournaments = [
    {
      title: "CPL 2025",
      description: "Previous season championship",
      date: "December 1-12, 2025",
      teams: "18 Teams",
      venue: "PSTU Cricket Ground",
      winner: "Team CSE Warriors",
      status: "Completed",
      statusColor: "bg-muted",
    },
    {
      title: "CPL 2024",
      description: "Inaugural season of CSE Premier League",
      date: "November 2024",
      teams: "16 Teams",
      venue: "PSTU Cricket Ground",
      winner: "Team Thunder Strikers",
      status: "Completed",
      statusColor: "bg-muted",
    },
  ];

  const renderTournamentCard = (tournament: any, index: number) => (
    <Card 
      key={index} 
      className="border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-scale-in overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-2 bg-gradient-accent"></div>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-2xl">{tournament.title}</CardTitle>
          <span className={`${tournament.statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
            {tournament.status}
          </span>
        </div>
        <CardDescription className="text-base">{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-accent" />
            <span>{tournament.teams}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground col-span-full">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{tournament.venue}</span>
          </div>
          {tournament.winner && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground col-span-full">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="font-semibold">Winner: {tournament.winner}</span>
            </div>
          )}
        </div>
        <Button className="w-full bg-gradient-accent shadow-accent">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-center animate-fade-in-up">
            CPL <span className="text-accent">Tournaments</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up">
            Complete tournament information, schedules, and results
          </p>

          {/* Tournaments Tabs */}
          <Tabs defaultValue="current" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            {/* Current Tournaments */}
            <TabsContent value="current" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {currentTournaments.map((tournament, index) => renderTournamentCard(tournament, index))}
              </div>

              {/* Tournament Overview */}
              <Card className="border-border shadow-glow animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-3xl">Tournament Overview</CardTitle>
                  <CardDescription className="text-lg">CSE Premier League 2026 - Main Championship</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">December 1 - 12, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-semibold">PSTU Cricket Ground</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teams</p>
                      <p className="font-semibold">20 Teams</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Format</p>
                      <p className="font-semibold">T20 Cricket</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tournament Structure and Prizes */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-2xl">Tournament Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">League Stage</h4>
                        <p className="text-sm text-muted-foreground">20 teams divided into 4 groups. Each team plays group matches.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Quarter Finals</h4>
                        <p className="text-sm text-muted-foreground">Top 2 teams from each group advance to knockouts.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Semi Finals</h4>
                        <p className="text-sm text-muted-foreground">Winners proceed to the championship final.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground font-bold">4</div>
                      <div>
                        <h4 className="font-semibold">Grand Final</h4>
                        <p className="text-sm text-muted-foreground">Championship match to crown the CPL 2026 winners.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover:shadow-glow transition-all animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-2xl">Prizes & Awards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-8 w-8 text-accent" />
                      <div>
                        <h4 className="font-semibold">Champions</h4>
                        <p className="text-sm text-muted-foreground">BDT 50,000 + Trophy + Medals</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Medal className="h-8 w-8 text-accent" />
                      <div>
                        <h4 className="font-semibold">Runners-up</h4>
                        <p className="text-sm text-muted-foreground">BDT 30,000 + Medals</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-8 w-8 text-accent" />
                      <div>
                        <h4 className="font-semibold">Individual Awards</h4>
                        <p className="text-sm text-muted-foreground">Player of Tournament, Best Batsman, Best Bowler, Best Fielder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Upcoming Tournaments */}
            <TabsContent value="upcoming" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {upcomingTournaments.map((tournament, index) => renderTournamentCard(tournament, index))}
              </div>
            </TabsContent>

            {/* Past Tournaments */}
            <TabsContent value="past" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {pastTournaments.map((tournament, index) => renderTournamentCard(tournament, index))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="border-accent/50 bg-gradient-card animate-scale-in">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Registration is now open for upcoming tournaments. Secure your team's spot!
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-accent shadow-accent">
                  Register Your Team Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentPage;
