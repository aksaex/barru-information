// src/app/admin/posts/new/page.tsx
"use client"; 

import { useState } from "react"; 
import { createPost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ImageIcon, PenLine } from "lucide-react"; // Icon biar keren
import ImageUpload from "@/components/ui/ImageUpload"; 
import Link from "next/link";

export default function NewPostPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32"> {/* pb-32 agar konten tidak tertutup tombol bawah */}
      
      {/* --- HEADER MOBILE --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Tulis Berita</h1>
      </div>

      <div className="max-w-2xl mx-auto mt-6 px-4">
        <form action={(formData) => {
            setLoading(true); // Efek loading saat diklik
            createPost(formData);
        }}>
            
          <div className="space-y-6">
            
            {/* 1. SECTION GAMBAR (Dipercantik) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Label className="text-base font-semibold">Foto Sampul</Label>
                </div>
                
                {/* Area Upload */}
                <div className="bg-slate-50 rounded-lg p-2 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
                    <ImageUpload onUpload={(url) => setImageUrl(url)} />
                </div>
                
                <input type="hidden" name="coverImageUrl" value={imageUrl} />
                {!imageUrl && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        * Wajib upload gambar agar berita menarik.
                    </p>
                )}
            </div>

            {/* 2. SECTION KONTEN */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-5 space-y-5">
                    
                    {/* Judul */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-600 font-medium">Judul Headline</Label>
                        <Input 
                            name="title" 
                            id="title" 
                            placeholder="Misal: Jembatan Barru Resmi Dibuka..." 
                            className="text-lg font-semibold placeholder:font-normal h-12 border-slate-200 focus-visible:ring-blue-500"
                            required 
                        />
                    </div>

                    <hr className="border-slate-100" />

                    {/* Isi Berita */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="content" className="text-slate-600 font-medium flex items-center gap-2">
                                <PenLine className="w-4 h-4" /> Isi Berita
                            </Label>
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">
                                Markdown Support
                            </span>
                        </div>
                        
                        <Textarea 
                            name="content" 
                            id="content" 
                            placeholder="Mulai menulis cerita..." 
                            className="min-h-[250px] md:min-h-[400px] text-base leading-relaxed border-slate-200 focus-visible:ring-blue-500 resize-none p-4" 
                            required 
                        />
                        <p className="text-xs text-slate-400">
                            Tips: Gunakan **kata tebal** untuk penekanan.
                        </p>
                    </div>

                </CardContent>
            </Card>

          </div>

          {/* --- STICKY BOTTOM ACTION BAR (Fitur Keren) --- */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t flex items-center justify-between gap-4 z-50 md:justify-end">
            
            <Link href="/admin" className="text-slate-500 text-sm font-medium hover:text-slate-800">
                Batal
            </Link>

            <Button 
                type="submit" 
                disabled={!imageUrl || loading} 
                className={`w-full md:w-auto px-8 font-bold transition-all ${
                    imageUrl 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
                {loading ? "Menerbitkan..." : (imageUrl ? "Terbitkan Berita" : "Upload Foto Dulu")}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}