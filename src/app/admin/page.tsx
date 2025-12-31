// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout, deletePost } from "@/lib/actions";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) redirect("/login");

  const { user } = await lucia.validateSession(sessionId);
  if (!user) redirect("/login");

  const media = await prisma.media.findUnique({
    where: { ownerId: user.id },
    include: {
      posts: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!media) return <div>Media tidak ditemukan</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* --- HEADER DASHBOARD --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Media: <span className="font-semibold text-blue-600">{media.name}</span>
          </p>
        </div>

        {/* --- TOMBOL AKSI HEADER --- */}
        {/* Tambahkan flex-wrap agar tombol turun ke baris baru jika tidak muat */}
        <div className="flex flex-wrap gap-2 items-center mb-2 md:mb-0">
          
          {/* --- TOMBOL KHUSUS OWNER --- */}
          {user.role === "OWNER" && (
            <Link href="/admin/users" className="flex-1 md:flex-none">
              <Button variant="destructive" className="w-full md:w-auto bg-red-600 hover:bg-red-700">
                Owner
              </Button>
            </Link>
          )}

          <Link href="/admin/posts/new" className="flex-1 md:flex-none">
            <Button className="w-full md:w-auto bg-blue-900 text-white">+ Tulis Berita</Button>
          </Link>

          <Link href="/admin/settings" className="flex-1 md:flex-none">
            <Button variant="secondary" className="w-full md:w-auto border">
              Ganti Pass
            </Button>
          </Link>

          <form action={logout} className="flex-1 md:flex-none">
            <Button variant="outline" type="submit" className="w-full md:w-auto">
              Logout
            </Button>
          </form>
        </div>
      </div>

      {/* --- STATISTIK --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{media.posts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* --- DAFTAR BERITA --- */}
      <Card>
        <CardHeader>
          <CardTitle>Berita Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {media.posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada berita.</p>
          ) : (
            <div className="space-y-6">
              {media.posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 last:border-0 last:pb-0 gap-4"
                >
                  {/* KIRI: Judul & Tanggal */}
                  <div className="space-y-1">
                    <p className="font-medium text-lg leading-tight">{post.title}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{new Date(post.createdAt).toLocaleDateString("id-ID")}</span>
                      <span>•</span>
                      <span className="text-green-600 text-xs font-bold px-2 py-0.5 bg-green-100 rounded-full">
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* KANAN: Tombol Edit & Hapus */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 md:flex-none">
                      <Button variant="secondary" size="sm" className="w-full md:w-auto">
                        Edit
                      </Button>
                    </Link>

                    <form action={deletePost} className="flex-1 md:flex-none">
                      <input type="hidden" name="postId" value={post.id} />
                      <Button
                        variant="destructive"
                        size="sm"
                        type="submit"
                        className="w-full md:w-auto"
                      >
                        Hapus
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
