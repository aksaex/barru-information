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
            select: { posts: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
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
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg"
                >
                  {/* Bagian Kiri: Info User */}
                  <div className="w-full sm:w-auto">
                    <p className="font-bold text-lg">{u.media?.name || "Tanpa Nama Media"}</p>
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{u.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total Berita: {u.media?._count?.posts || 0}
                    </p>
                  </div>

                  {/* Bagian Kanan: Tombol */}
                  <form action={deleteUserByOwner} className="w-full sm:w-auto">
                    <input type="hidden" name="targetUserId" value={u.id} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                    >
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
