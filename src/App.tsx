import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import Gallery from "./pages/Gallery";
import TournamentPage from "./pages/TournamentPage";
import TournamentDetails from "./pages/TournamentDetails";
import Matches from "./pages/Matches";
import MatchCenter from "./pages/MatchCenter";
import Team from "./pages/Team";
import TeamDepartment from "./pages/TeamDepartment";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Admin from "./pages/Admin";
import PlayerDashboard from "./pages/PlayerDashboard";
import Auction from "./pages/Auction";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/tournament" element={<TournamentPage />} />
            <Route path="/tournament/:id" element={<TournamentDetails />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/match/:tournamentId/:matchId" element={<MatchCenter />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:dept" element={<TeamDepartment />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* Protected: Player */}
            <Route element={<ProtectedRoute allowRoles={["player", "admin"]} />}> 
              {/* Both roles can view dashboard; admin will likely redirect to /admin elsewhere */}
              <Route path="/dashboard" element={<PlayerDashboard />} />
            </Route>

            {/* Protected: Admin */}
            <Route element={<ProtectedRoute allowRoles={["admin"]} />}> 
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/auction" element={<Auction />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
