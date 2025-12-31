// src/app/news/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Markdown from "react-markdown"; // <--- IMPORT BARU
import { Metadata, ResolvingMetadata } from "next"; // <--- IMPORT UNTUK SEO

// FUNGSI KHUSUS UNTUK SEO (Judul Tab & Preview WA)
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  // Ambil data berita (cuma ambil judul & gambar biar cepat)
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImageUrl: true }
  });

  if (!post) {
    return { title: "Berita Tidak Ditemukan" };
  }

  return {
    title: post.title, // Judul Tab Browser
    description: post.excerpt, // Deskripsi di Google
    openGraph: {
      images: post.coverImageUrl ? [post.coverImageUrl] : [], // Gambar saat share WA
    },
  };
}

// --- HALAMAN DETAIL BERITA ---
export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: { media: true }
  });

  if (!post) {
    return <div className="p-10 text-center">Berita tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
        <nav className="border-b h-16 flex items-center px-4 md:px-8 bg-white sticky top-0 z-10">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
                Kembali
            </Link>
        </nav>

        <article className="max-w-3xl mx-auto px-4 py-10">
            {post.coverImageUrl && (
              <img 
                src={post.coverImageUrl} 
                alt={post.title} 
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl mb-8 shadow-md"
              />
            )}

            <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {post.media.name}
                </span>
                <span className="text-slate-500 text-sm ml-4">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight text-slate-900">
                {post.title}
            </h1>

            {/* --- BAGIAN INI YANG BERUBAH JADI CANGGIH --- */}
            {/* Class 'prose' akan otomatis merapikan paragraf */}
            <div className="prose prose-lg max-w-none text-slate-700">
                <Markdown 
                  components={{
                    a: ({node, ...props}) => (
                      <a 
                        {...props} 
                        className="text-blue-600 hover:underline font-bold" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      />
                    )
                  }}
                >
                  {post.content}
                </Markdown>
            </div>
        </article>
    </div>
  );
}
