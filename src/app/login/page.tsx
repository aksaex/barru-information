// src/app/login/page.tsx
import { login } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// REVISI: Tambahkan props 'searchParams' untuk menangkap error dari URL
// (Next.js 15 mewajibkan searchParams berupa Promise)
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  
  // 1. Ambil pesan error (jika ada)
  const { error } = await searchParams;

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login Media</CardTitle>
          <CardDescription>Masuk untuk mengelola berita.</CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* 2. LOGIKA UI: Jika ada error, tampilkan kotak merah ini */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
              <strong className="font-bold">Gagal Masuk!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <form action={login} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email" 
                id="email" 
                type="email" 
                placeholder="email terdaftar" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                name="password" 
                id="password" 
                type="password" 
                required 
              />
            </div>

            <Button type="submit" className="w-full">
              Masuk Dashboard
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Belum punya akun media?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Daftar di sini
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}