import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const Auth = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "player" as "player" | "admin" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    avatar: "" as string
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return tab === "register" ? "register" : "login";
  }, [location.search]);

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: loginData.email, password: loginData.password, role: loginData.role });
      toast.success("Logged in successfully");
      navigate(loginData.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    try {
      await register({ name: registerData.name, email: registerData.email, password: registerData.password, avatar: registerData.avatar });
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  const onPickAvatar = () => fileInputRef.current?.click();
  const onAvatarChosen: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setRegisterData((d) => ({ ...d, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto animate-fade-in-up">
            <Card className="border-border shadow-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Welcome to CPL</CardTitle>
                <CardDescription>Login or create an account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={defaultTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your.email@pstu.ac.bd"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-role">Role</Label>
                        <Select value={loginData.role} onValueChange={(v: "player" | "admin") => setLoginData({ ...loginData, role: v })}>
                          <SelectTrigger id="login-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="player">Player</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-accent shadow-accent">
                        Login
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Avatar picker */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={registerData.avatar} alt={registerData.name || "avatar"} />
                            <AvatarFallback>{(registerData.name || "P").slice(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <button
                            type="button"
                            onClick={onPickAvatar}
                            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-accent"
                            aria-label="Change avatar"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <input ref={fileInputRef} onChange={onAvatarChosen} type="file" accept="image/*" className="hidden" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Your full name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your.email@pstu.ac.bd"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm">Confirm Password</Label>
                        <Input
                          id="register-confirm"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-accent shadow-accent">
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
