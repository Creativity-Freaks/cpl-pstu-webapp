import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import heroImg from "@/assets/hero-cricket.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const u = await login({ email: values.email, password: values.password });
      toast.success("Welcome back!");
      navigate(u.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast.error("Login failed");
    }
  });

  return (
    <div className="min-h-screen relative">
      {/* Background sports gradient */}
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
                <h2 className="text-3xl font-bold">CPL Login</h2>
                <p className="text-muted-foreground max-w-md mt-2">Enter the arena — manage your profile, view fixtures, and more.</p>
              </div>
            </div>

            <div className="max-w-md w-full mx-auto animate-fade-in-up">
              <Card className="border-border shadow-glow">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Welcome back</CardTitle>
                  <CardDescription>Login to your CPL account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@pstu.ac.bd" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" {...form.register("password")} />
                      {form.formState.errors.password && (
                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Switch checked={!!form.watch("remember")} onCheckedChange={(v) => form.setValue("remember", v)} />
                        Remember me
                      </label>
                      <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-accent shadow-accent">Login</Button>
                    <p className="text-sm text-center text-muted-foreground">
                      New to CPL? <Link to="/register" className="text-accent hover:underline">Create an account</Link>
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

export default Login;
