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
    semester: z.string().min(1, "Enter semester"),
    paymentMethod: z.enum(["Bkash", "Nagad", "Rocket", "Cash", "Bank"], {
      required_error: "Select a payment method",
    }),
    transactionId: z.string().min(4, "Enter a valid transaction ID"),
    paymentNumber: z.string().min(6, "Enter payment number"),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
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
      semester: "",
      paymentMethod: undefined as unknown as FormValues["paymentMethod"],
      transactionId: "",
      paymentNumber: "",
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
        semester: values.semester,
        paymentMethod: values.paymentMethod,
        transactionId: values.transactionId,
        paymentNumber: values.paymentNumber,
      });
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  });

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
      <Navbar />
      <main className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-xl border-border/60 shadow-glow backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Create account</CardTitle>
                <CardDescription>Become a CPL player</CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  Fields marked <span className="text-red-500">*</span> are required
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" type="text" placeholder="Your full name" required aria-required="true" {...form.register("name")} />
                    {form.formState.errors.name && (
                      <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" type="email" placeholder="your.email@pstu.ac.bd" required aria-required="true" {...form.register("email")} />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session">
                        Session <span className="text-red-500">*</span>
                      </Label>
                      <Input id="session" type="text" placeholder="e.g., 2024-25" required aria-required="true" {...form.register("session")} />
                      {form.formState.errors.session && (
                        <p className="text-xs text-red-500">{form.formState.errors.session.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Player Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={form.watch("playerType") || ""} onValueChange={(v) => form.setValue("playerType", v)}>
                        <SelectTrigger aria-required="true">
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

                  {/* Academic */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">
                        Semester <span className="text-red-500">*</span>
                      </Label>
                      <Input id="semester" type="text" placeholder="e.g., 3rd" required aria-required="true" {...form.register("semester")} />
                      {form.formState.errors.semester && (
                        <p className="text-xs text-red-500">{form.formState.errors.semester.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-semibold mb-3">Payment Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Payment Method <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={form.watch("paymentMethod") || ""}
                          onValueChange={(v) => form.setValue("paymentMethod", v as FormValues["paymentMethod"]) }
                        >
                          <SelectTrigger aria-required="true">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bkash">bKash</SelectItem>
                            <SelectItem value="Nagad">Nagad</SelectItem>
                            <SelectItem value="Rocket">Rocket</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank">Bank</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.paymentMethod && (
                          <p className="text-xs text-red-500">{form.formState.errors.paymentMethod.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentNumber">
                          Payment Number <span className="text-red-500">*</span>
                        </Label>
                        <Input id="paymentNumber" type="text" placeholder="e.g., 01XXXXXXXXX" required aria-required="true" {...form.register("paymentNumber")} />
                        {form.formState.errors.paymentNumber && (
                          <p className="text-xs text-red-500">{form.formState.errors.paymentNumber.message}</p>
                        )}
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="transactionId">
                          Transaction ID <span className="text-red-500">*</span>
                        </Label>
                        <Input id="transactionId" type="text" placeholder="e.g., TX1234ABCD" required aria-required="true" {...form.register("transactionId")} />
                        {form.formState.errors.transactionId && (
                          <p className="text-xs text-red-500">{form.formState.errors.transactionId.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture (bottom) */}
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-semibold mb-3">
                      Profile Picture <span className="text-muted-foreground text-xs">(optional)</span>
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={form.watch("avatar") || ""} alt={form.watch("name") || "avatar"} />
                          <AvatarFallback>
                            {(form.watch("name") || "P").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={onPickAvatar}
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-accent"
                          aria-label="Change avatar"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <Button type="button" variant="secondary" onClick={onPickAvatar}>
                          Upload Image
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">JPG/PNG, square image looks best.</p>
                      </div>
                      <input ref={fileInputRef} onChange={onAvatarChosen} type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input id="password" type="password" required aria-required="true" {...form.register("password")} />
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input id="confirmPassword" type="password" required aria-required="true" {...form.register("confirmPassword")} />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
                    )}
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
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
