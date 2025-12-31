// src/components/EditPostForm.tsx
"use client";

import { useState } from "react";
import { updatePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ImageIcon, PenLine, Info } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";

interface EditPostFormProps {
  post: {
    id: string;
    title: string;
    content: string;
    coverImageUrl: string | null;
  };
}

export default function EditPostForm({ post }: EditPostFormProps) {
  // Isi state awal dengan data dari database
  const [imageUrl, setImageUrl] = useState(post.coverImageUrl || "");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      
      {/* --- HEADER MOBILE --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Edit Berita</h1>
      </div>

      <div className="max-w-2xl mx-auto mt-6 px-4">
        <form action={(formData) => {
            setLoading(true);
            updatePost(formData);
        }}>
            
          {/* ID RAHASIA UNTUK UPDATE */}
          <input type="hidden" name="postId" value={post.id} />

          <div className="space-y-6">
            
            {/* 1. SECTION GAMBAR */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Label className="text-base font-semibold">Foto Sampul</Label>
                </div>

                {/* Preview Gambar Lama/Saat Ini */}
                {imageUrl && (
                  <div className="mb-4 relative group">
                    <img 
                      src={imageUrl} 
                      alt="Current cover" 
                      className="w-full h-48 object-cover rounded-lg border shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white text-xs font-medium">Gambar Saat Ini</p>
                    </div>
                  </div>
                )}
                
                {/* Tombol Ganti Gambar */}
                <div className="bg-slate-50 rounded-lg p-2 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
                    <p className="text-xs text-center text-slate-400 mb-2">Klik tombol untuk mengganti gambar</p>
                    <ImageUpload onUpload={(url) => setImageUrl(url)} />
                </div>
                
                {/* Input tersembunyi untuk menyimpan URL baru */}
                <input type="hidden" name="coverImageUrl" value={imageUrl} />
            </div>

            {/* 2. SECTION KONTEN */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-5 space-y-5">
                    
                    {/* Judul */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-600 font-medium">Judul Berita</Label>
                        <Input 
                            name="title" 
                            id="title" 
                            defaultValue={post.title}
                            placeholder="Ubah judul berita" 
                            className="text-lg font-semibold placeholder:font-normal h-12 border-slate-200 focus-visible:ring-blue-500"
                            required 
                        />
                    </div>

                    <hr className="border-slate-100" />

                    {/* Isi Berita */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="content" className="text-slate-600 font-medium flex items-center gap-2">
                                Isi Berita
                            </Label>
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium border border-slate-200">
                                Markdown Supported
                            </span>
                        </div>
                        
                        <Textarea 
                            name="content" 
                            id="content" 
                            defaultValue={post.content}
                            placeholder="Mulai menulis cerita..." 
                            className="min-h-[250px] md:min-h-[400px] text-base leading-relaxed border-slate-200 focus-visible:ring-blue-500 resize-none p-4 font-normal" 
                            required 
                        />
                        
                        {/* TIPS */}
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs text-slate-600 space-y-1">
                            <p className="font-bold text-slate-700 mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1 ml-1">
                                <li>Untuk: <b>**teks tebal**</b></li>
                                <li>Untuk: <code className="bg-white border px-1 rounded text-blue-600 font-mono">[Link]</code></li>
                            </ul>
                        </div>
                    </div>

                </CardContent>
            </Card>

          </div>

          {/* --- STICKY BOTTOM ACTION BAR (KONSISTEN) --- */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t flex items-center gap-3 z-50 md:justify-end">
            
            <Link href="/admin" className="w-1/3 md:w-auto">
                <Button variant="outline" type="button" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium">
                    Batal
                </Button>
            </Link>

            <Button 
                type="submit" 
                disabled={loading} 
                className="w-2/3 md:w-auto px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
            >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}