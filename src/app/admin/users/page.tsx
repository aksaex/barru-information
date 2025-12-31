// src/app/admin/users/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteUserByOwner } from "@/lib/actions";
import Link from "next/link";

export default async function SuperAdminPage() {
  // 1. Cek Login & Role
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) redirect("/login");
  
  const { user } = await lucia.validateSession(sessionId);
  
  // PROTEKSI KERAS: Kalau bukan OWNER, lempar balik
  if (!user || user.role !== "OWNER") {
    return redirect("/admin");
  }

  // 2. Ambil User BESERTA Media & Jumlah Beritanya
  const allUsers = await prisma.user.findMany({
    where: {
      NOT: { id: user.id } // Jangan tampilkan akun owner sendiri
    },
    include: {
      media: {
        include: {
          _count: {
            select: { posts: true } // Hitung posts DI DALAM Media
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 space-y-8 bg-red-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-900">Kontrol Owner</h1>
          <p className="text-red-700">Tindakan di sini permanen.</p>
        </div>
        <Link href="/admin">
            <Button variant="outline">Kembali</Button>
        </Link>
      </div>

      <Card className="border-red-200">
        <CardHeader>
            <CardTitle>Media Terdaftar ({allUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {allUsers.length === 0 ? (
                <p>Belum ada user.</p>
            ) : (
                <div className="space-y-4">
                    {allUsers.map((u) => (
                        <div key={u.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-bold text-lg">{u.media?.name || "Tanpa Nama Media"}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {/* PERBAIKAN DI SINI: Ambil count dari dalam media */}
                                    Total Berita: {u.media?._count?.posts || 0}
                                </p>
                            </div>
                            
                            <form action={deleteUserByOwner}>
                                <input type="hidden" name="targetUserId" value={u.id} />
                                <Button variant="destructive" size="sm">
                                    Hapus Media & User
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}