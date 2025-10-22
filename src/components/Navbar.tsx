import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Tournament", path: "/tournament" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-xl">CPL</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              CSE Premier League
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <Link to="/auth">
                <Button variant="default" className="bg-gradient-accent shadow-accent">
                  Login
                </Button>
              </Link>
            ) : (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="default" className="bg-gradient-accent shadow-accent">
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-secondary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full bg-gradient-accent">
                    Login
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)} className="flex-1">
                    <Button variant="default" className="w-full bg-gradient-accent">
                      {user.role === "admin" ? "Admin" : "Dashboard"}
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1" onClick={() => { logout(); setIsOpen(false); }}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
