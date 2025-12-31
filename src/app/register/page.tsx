// src/app/register/page.tsx
import { signup } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Daftar Media Baru</CardTitle>
          <CardDescription>Mulai bangun portal berita lokalmu.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form ini akan mengirim data ke fungsi 'signup' di server */}
          <form action={signup} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="mediaName">Nama Media</Label>
              <Input name="mediaName" id="mediaName" placeholder="Contoh:Tentang Barru" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" placeholder="admin@barru.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full">
              Daftar & Buat Media
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}