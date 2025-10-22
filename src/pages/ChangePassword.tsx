import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  current: z.string().min(1, "Enter your current password"),
  password: z.string().min(6, "New password must be at least 6 characters"),
  confirm: z.string().min(6, "Confirm your new password"),
}).refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

type FormValues = z.infer<typeof schema>;

const ChangePassword = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async () => {
    // Mock change password
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password changed successfully (mock)");
    form.reset();
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-border shadow-glow">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" {...form.register("current")} />
                    {form.formState.errors.current && <p className="text-xs text-red-500">{form.formState.errors.current.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" {...form.register("password")} />
                    {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input id="confirm" type="password" {...form.register("confirm")} />
                    {form.formState.errors.confirm && <p className="text-xs text-red-500">{form.formState.errors.confirm.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-gradient-accent">Update Password</Button>
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

export default ChangePassword;
