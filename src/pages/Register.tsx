import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import heroImg from "@/assets/hero-cricket.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    session: z.string().min(2, "Enter session (e.g., 2024-25)"),
    playerType: z.string().nonempty("Select player type"),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      session: "",
      playerType: "",
      avatar: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickAvatar = () => fileInputRef.current?.click();
  const onAvatarChosen: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => form.setValue("avatar", reader.result as string, { shouldDirty: true });
    reader.readAsDataURL(file);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar,
        session: values.session,
        playerType: values.playerType,
      });
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  });

  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative hidden lg:block animate-fade-in-up">
              <div className="rounded-2xl overflow-hidden shadow-glow border border-border">
                <img src={"src/assets/crick3.jpg"} className="w-full h-[560px] object-cover" alt="CPL Cricket" />
              </div>
              <div className="mt-6">
                <h2 className="text-3xl font-bold">Join the League</h2>
                <p className="text-muted-foreground max-w-md mt-2">Register as a player — set your role, share your details, and prepare for the season.</p>
              </div>
            </div>

            <div className="max-w-md w-full mx-auto animate-fade-in-up">
              <Card className="border-border shadow-glow">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Create account</CardTitle>
                  <CardDescription>Become a CPL player</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={form.watch("avatar") || ""} alt={form.watch("name") || "avatar"} />
                          <AvatarFallback>{(form.watch("name") || "P").slice(0,2).toUpperCase()}</AvatarFallback>
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" placeholder="Your full name" {...form.register("name")} />
                      {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@pstu.ac.bd" {...form.register("email")} />
                      {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session">Session</Label>
                        <Input id="session" type="text" placeholder="e.g., 2024-25" {...form.register("session")} />
                        {form.formState.errors.session && (
                          <p className="text-xs text-red-500">{form.formState.errors.session.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Player Type</Label>
                        <Select value={form.watch("playerType") || ""} onValueChange={(v) => form.setValue("playerType", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Batsman">Batsman</SelectItem>
                            <SelectItem value="Bowler">Bowler</SelectItem>
                            <SelectItem value="All-rounder">All-rounder</SelectItem>
                            <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.playerType && (
                          <p className="text-xs text-red-500">{form.formState.errors.playerType.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" {...form.register("password")} />
                      {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                      {form.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-gradient-accent shadow-accent">Create Account</Button>
                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
