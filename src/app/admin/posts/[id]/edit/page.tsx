// src/app/admin/posts/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";

// Kita terima 'params' untuk tahu berita mana yang mau diedit
export default async function EditPostPage({ params }: { params: { id: string } }) {
  // Next.js 15 Wajib 'await params'
  const { id } = await params;

  // 1. Cek Login
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) redirect("/login");

  // 2. Ambil Data Berita Lama dari Database
  const post = await prisma.post.findUnique({
    where: { id: id }
  });

  if (!post) {
    return <div className="p-8">Berita tidak ditemukan atau sudah dihapus.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Berita</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePost} className="space-y-6">
            
            {/* INPUT RAHASIA: ID Berita (Biar sistem tahu mana yang diupdate) */}
            <input type="hidden" name="postId" value={post.id} />
            
            {/* TAMBAHAN INPUT GAMBAR DI EDIT PAGE */}
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Link Gambar (URL)</Label>
              <Input 
                name="coverImageUrl" 
                id="coverImageUrl" 
                defaultValue={post.coverImageUrl || ""} // <--- KUNCI: Isi link lama
                placeholder="https://contoh.com/gambar.jpg" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Berita</Label>
              <Input 
                name="title" 
                id="title" 
                defaultValue={post.title} // <--- KUNCI: Isi otomatis judul lama
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Isi Berita</Label>
              <Textarea 
                name="content" 
                id="content" 
                defaultValue={post.content} // <--- KUNCI: Isi otomatis konten lama
                className="min-h-[300px] font-mono" 
                required 
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Simpan Perubahan</Button>
              
              {/* Tombol Batal kembali ke dashboard */}
              <Link href="/admin">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
