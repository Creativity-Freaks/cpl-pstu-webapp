import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Shield, Users, Trophy, Gavel, LogOut } from "lucide-react";

const AdminPage = () => {
  const { user, logout } = useAuth();

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
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Registrations</CardTitle>
                <CardDescription>Review player registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">View Registrations</Button>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
