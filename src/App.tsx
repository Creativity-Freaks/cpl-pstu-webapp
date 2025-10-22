import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import Gallery from "./pages/Gallery";
import TournamentPage from "./pages/TournamentPage";
import Team from "./pages/Team";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
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
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
            <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />

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
