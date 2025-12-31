// src/app/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Kita butuh input
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0;

// Update: Terima 'searchParams' untuk menangkap kata kunci pencarian
export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // 1. Ambil kata kunci dari URL (Contoh: ?q=banjir)
  // Ingat: Di Next.js 15, searchParams itu harus di-await
  const params = await searchParams;
  const keyword = params.q || ""; // Kalau kosong, anggap string kosong

  // 2. Ambil Berita (Dengan Filter Pencarian)
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      // LOGIKA PENCARIAN:
      // Cari judul YANG MENGANDUNG kata kunci (insensitive = huruf besar/kecil dianggap sama)
      title: {
        contains: keyword,
        mode: "insensitive", 
      }
    },
    orderBy: { createdAt: "desc" },
    include: { media: true }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* --- NAVBAR --- */}
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            Infonya<span className="text-black">Barru</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/login"> 
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION + SEARCH BAR --- */}
      <section className="bg-slate-50 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Informasi Terkini Kabupaten Barru
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Platform informasi publik yang ramah warga dan bebas kepentingan.
          </p>

          {/* FORM PENCARIAN SEDERHANA */}
          <form action="/" method="GET" className="max-w-md mx-auto flex gap-2">
            <Input 
              name="q" 
              placeholder="Apa yang ingin kamu ketahui hari ini?" 
              defaultValue={keyword} // Biar tulisan gak hilang habis dicari
              className="bg-white"
            />
            <Button type="submit">Cari</Button>
          </form>

        </div>
      </section>

      {/* --- LIST BERITA --- */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-bold">
            {keyword ? `Hasil Pencarian: "${keyword}"` : "Info Terbaru"}
          </h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
            <p className="text-xl font-semibold text-slate-700">Tidak ditemukan.</p>
            <p className="text-muted-foreground">
              Coba kata kunci lain atau <Link href="/" className="text-blue-600 underline">Lihat Semua Berita</Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                {/* Bagian Gambar */}
                {post.coverImageUrl && (
                  <div className="w-full h-48 overflow-hidden bg-slate-200">
                    <img 
                      src={post.coverImageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="text-xs font-semibold text-blue-600 mb-2">
                    {post.media.name}
                  </div>
                  <Link href={`/news/${post.slug}`}>
                    <CardTitle className="hover:underline cursor-pointer leading-tight">
                      {post.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                       day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-8 text-center text-sm">
        <p>&copy; Infonya Barru 2026.@aksaex</p>
      </footer>
    </div>
  );
}