// src/lib/actions.ts
"use server";

import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. FUNGSI SIGNUP (DAFTAR)
export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mediaName = formData.get("mediaName") as string;

  if (!email || !password || !mediaName) {
    return { error: "Semua kolom wajib diisi" };
  }

  try {
    const passwordHash = await hash(password, 10);
    const mediaSlug = mediaName.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const newUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: passwordHash,
        media: {
          create: {
            name: mediaName,
            slug: mediaSlug
          }
        }
      }
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    const cookieStore = await cookies(); 
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  } catch (e: any) {
    if (e.code === 'P2002') {
      return { error: "Email sudah terdaftar! Gunakan email lain." };
    }
    console.error("Error:", e);
    return { error: "Gagal mendaftar." };
  }

  return redirect("/admin");
}

// 2. FUNGSI BUAT BERITA (CREATE POST)
export async function createPost(formData: FormData) {
  // SAFETY: Pakai '|| ""' biar TypeScript tidak marah kalau null
  const title = (formData.get("title") as string) || "";
  const content = (formData.get("content") as string) || "";
  const coverImageUrl = (formData.get("coverImageUrl") as string) || "";

  // Validasi Manual
  if (!title || !content) {
    return { error: "Judul dan Isi berita wajib diisi!" };
  }

  // Cek Login
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return redirect("/register");
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return redirect("/register");

  // Cari Media
  const userMedia = await prisma.media.findUnique({
    where: { ownerId: user.id }
  });

  if (!userMedia) return { error: "Media tidak ditemukan" };

  // Buat Slug yang Aman
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Hapus simbol aneh
    .replace(/[\s_-]+/g, "-") // Ganti spasi jadi strip
    .replace(/^-+|-+$/g, "") + "-" + Date.now(); 

  // Simpan ke Database
  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImageUrl,
        excerpt: content.slice(0, 150) + "...",
        mediaId: userMedia.id,
        status: "PUBLISHED"
      }
    });
  } catch (error) {
    console.error("Gagal simpan berita:", error);
    return { error: "Gagal menyimpan berita." };
  }

  return redirect("/admin");
}

// 3. FUNGSI LOGOUT
export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  
  if (!sessionId) {
    return redirect("/login");
  }

  await lucia.invalidateSession(sessionId);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/");
}

// 4. FUNGSI HAPUS BERITA
export async function deletePost(formData: FormData) {
  const postId = formData.get("postId") as string;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return redirect("/register");
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return redirect("/register");

  const count = await prisma.post.count({
    where: {
      id: postId,
      media: { ownerId: user.id }
    }
  });

  if (count > 0) {
    await prisma.post.delete({ where: { id: postId } });
  }

  return redirect("/admin");
}

// 5. FUNGSI LOGIN (DENGAN FEEDBACK ERROR)
export async function login(formData: FormData) {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    // Redirect dengan pesan error di URL
    return redirect("/login?error=Email dan password wajib diisi");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return redirect("/login?error=Email tidak terdaftar");
    }

    const validPassword = await compare(password, user.password);
    
    if (!validPassword) {
      return redirect("/login?error=Password salah");
    }

    // Login Berhasil
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  } catch (e) {
    // Kalau error redirect (NEXT_REDIRECT) biarkan lewat
    if ((e as Error).message === "NEXT_REDIRECT") {
      throw e;
    }
    console.error("Login Error:", e);
    return redirect("/login?error=Terjadi kesalahan sistem");
  }

  return redirect("/admin");
}

// 6. FUNGSI UPDATE BERITA
export async function updatePost(formData: FormData) {
  const postId = formData.get("postId") as string;
  const title = (formData.get("title") as string) || "";
  const content = (formData.get("content") as string) || "";
  const coverImageUrl = (formData.get("coverImageUrl") as string) || "";

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return redirect("/login");
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return redirect("/login");

  const count = await prisma.post.count({
    where: {
      id: postId,
      media: { ownerId: user.id }
    }
  });

  if (count === 0) return { error: "Anda tidak punya izin mengedit berita ini." };

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      coverImageUrl,
      updatedAt: new Date()
    }
  });

  return redirect("/admin");
}

// 7. FUNGSI KHUSUS OWNER: HAPUS USER JAHAT
export async function deleteUserByOwner(formData: FormData) {
  const targetUserId = formData.get("targetUserId") as string;

  // 1. Cek Login
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return redirect("/login");
  
  const { user } = await lucia.validateSession(sessionId);
  // 2. CEK JABATAN: Kalau bukan OWNER, tendang!
  if (!user || user.role !== "OWNER") {
    return { error: "Anda tidak punya akses!" };
  }

  // 3. Hapus User tersebut (Otomatis Media & Postingan dia terhapus karena relasi database)
  await prisma.user.delete({
    where: { id: targetUserId }
  });

  return redirect("/admin/users"); // Refresh halaman list user
}

// ... (biarkan kode deleteUserByOwner di atas aman)

// 8. FUNGSI GANTI PASSWORD
export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  // 1. Cek Login
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return redirect("/login");
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return redirect("/login");

  // 2. Ambil Data User Asli dari Database (untuk cek password lama)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser) return { error: "User tidak ditemukan." };

  // 3. Cek: Apakah Password Lama BENAR?
  const isPasswordValid = await compare(oldPassword, dbUser.password);
  if (!isPasswordValid) {
    return { error: "Password lama salah!" }; // Gagal kalau password lama ngawur
  }

  // 4. Enkripsi Password BARU
  const newPasswordHash = await hash(newPassword, 10);

  // 5. Simpan ke Database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newPasswordHash
    }
  });

  // 6. Sukses -> Redirect ke Dashboard
  return redirect("/admin?success=Password berhasil diganti");
}