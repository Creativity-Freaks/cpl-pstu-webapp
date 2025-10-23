import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/useAuth";
import { useRef } from "react";
import { toast } from "sonner";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!user) return null;

  const onPickAvatar = () => fileInputRef.current?.click();
  const onAvatarChosen: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateUser({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border shadow-glow">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || ''} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" onClick={onPickAvatar} className="bg-gradient-accent">Change Avatar</Button>
                    <input ref={fileInputRef} onChange={onAvatarChosen} type="file" accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} onBlur={(e) => updateUser({ name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user.email} disabled />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session">Session</Label>
                    <Input id="session" placeholder="e.g., 2024-25" defaultValue={user.session || ''} onBlur={(e) => updateUser({ session: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerType">Player Type</Label>
                    <Input id="playerType" placeholder="e.g., Batsman" defaultValue={user.playerType || ''} onBlur={(e) => updateUser({ playerType: e.target.value })} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" placeholder="e.g., 3rd" defaultValue={user.semester || ''} onBlur={(e) => updateUser({ semester: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Input id="paymentMethod" placeholder="e.g., bKash" defaultValue={user.paymentMethod || ''} onBlur={(e) => updateUser({ paymentMethod: e.target.value })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentNumber">Payment Number</Label>
                    <Input id="paymentNumber" placeholder="01XXXXXXXXX" defaultValue={user.paymentNumber || ''} onBlur={(e) => updateUser({ paymentNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input id="transactionId" placeholder="TX1234ABCD" defaultValue={user.transactionId || ''} onBlur={(e) => updateUser({ transactionId: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Button className="bg-gradient-accent" onClick={() => toast.success("Saved changes")}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
