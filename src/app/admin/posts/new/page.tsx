// src/app/admin/posts/new/page.tsx
"use client"; // <--- INI KUNCI SAKTINYA (Wajib ada biar onClick jalan)

import { createPost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Tulis Berita Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPost} className="space-y-6">
            
            {/* TAMBAHAN INPUT GAMBAR */}
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Link Gambar</Label>
              <Input 
                name="coverImageUrl" 
                id="coverImageUrl" 
                placeholder="https://contoh.com/gambar.jpg" 
              />
              <p className="text-xs text-muted-foreground">
                Salin link gambar dari Google atau Unsplash, lalu tempel di sini.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Berita</Label>
              <Input 
                name="title" 
                id="title" 
                placeholder="Contoh: Panen Raya di Manuba Berjalan Lancar" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Isi Berita</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Tips: Gunakan **tebal** untuk menebalkan dan tanda string untuk link.
              </p>
              <Textarea 
                name="content" 
                id="content" 
                placeholder="Tulis detail berita anda di sini" 
                className="min-h-[300px] font-mono" 
                required 
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Terbitkan</Button>
              {/* Tombol ini butuh 'use client' karena pakai onClick */}
              <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Batal
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
