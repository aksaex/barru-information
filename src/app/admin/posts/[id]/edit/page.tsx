// src/app/admin/posts/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import EditPostForm from "@/components/EditPostForm"; // Import Form Baru

// Halaman Server Component
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: Wajib await params
  const { id } = await params;

  // 1. Cek Login
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) redirect("/login");

  // 2. Ambil Data Berita
  const post = await prisma.post.findUnique({
    where: { id: id }
  });

  if (!post) {
    return <div className="p-8 text-center text-red-500">Berita tidak ditemukan.</div>;
  }

  // 3. Render Form Client Component
  return <EditPostForm post={post} />;
}