// src/app/admin/settings/page.tsx
import { changePassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
          <CardDescription>Amankan akun kamu sekarang.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={changePassword} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Password Lama</Label>
              <Input 
                name="oldPassword" 
                id="oldPassword" 
                type="password" 
                placeholder="Masukkan password saat ini..."
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru Yang Kuat</Label>
              <Input 
                name="newPassword" 
                id="newPassword" 
                type="password" 
                placeholder="Minimal 8 karakter..."
                required 
              />
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="submit" className="w-full">
                  Simpan Password Baru
                </Button>
            </div>
            
            <div className="text-center mt-4">
                 <Link href="/admin">
                    <Button variant="ghost" type="button" className="text-muted-foreground">
                        Batal & Kembali ke Dashboard
                    </Button>
                </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}