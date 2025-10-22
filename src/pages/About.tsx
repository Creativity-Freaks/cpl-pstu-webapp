import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
              About <span className="text-accent">CPL</span>
            </h1>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground animate-fade-in-up">
              <p className="text-xl">
                The CSE Premier League (CPL) is the flagship sporting event of the Computer Science & Engineering department at Patuakhali Science and Technology University. Since its inception, CPL has become more than just a cricket tournament - it's a celebration of sportsmanship, teamwork, and the vibrant spirit of our department.
              </p>
              
              <Card className="my-8 border-border">
                <CardContent className="p-8 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                  <p>
                    To foster a competitive yet friendly environment where CSE students can showcase their athletic talents, build lasting friendships, and create unforgettable memories while maintaining the highest standards of sportsmanship and fair play.
                  </p>
                </CardContent>
              </Card>

              <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">What Makes CPL Special</h2>
              
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <Card className="border-border hover:shadow-glow transition-all">
                  <CardContent className="pt-6 text-center space-y-3">
                    <Trophy className="h-12 w-12 text-accent mx-auto" />
                    <h3 className="font-bold">Professional Standards</h3>
                    <p className="text-sm">Official rules, live scoring, and tournament management</p>
                  </CardContent>
                </Card>
                <Card className="border-border hover:shadow-glow transition-all">
                  <CardContent className="pt-6 text-center space-y-3">
                    <Users className="h-12 w-12 text-accent mx-auto" />
                    <h3 className="font-bold">Community Building</h3>
                    <p className="text-sm">Bringing together students from all batches</p>
                  </CardContent>
                </Card>
                <Card className="border-border hover:shadow-glow transition-all">
                  <CardContent className="pt-6 text-center space-y-3">
                    <Target className="h-12 w-12 text-accent mx-auto" />
                    <h3 className="font-bold">Skill Development</h3>
                    <p className="text-sm">Platform to develop athletic and leadership skills</p>
                  </CardContent>
                </Card>
              </div>

              <p>
                Each season of CPL brings together the best cricket talent from our department, with teams competing in an exciting T20 format. From nail-biting finishes to spectacular performances, CPL has consistently delivered memorable moments that become part of our department's legacy.
              </p>

              <p>
                Beyond the matches, CPL serves as a platform for students to develop essential life skills such as teamwork, leadership, decision-making under pressure, and graceful handling of both victory and defeat. The tournament also strengthens bonds between different batches, creating a unified and spirited CSE community.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
