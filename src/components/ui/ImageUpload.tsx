"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "barru-news"); // Preset kamu
    formData.append("cloud_name", "dhfsitdr0"); // Cloud name kamu

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhfsitdr0/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data); // <-- Tambahan log untuk lihat isi response

      if (data.secure_url) {
        setPreview(data.secure_url);
        onUpload(data.secure_url);
      } else {
        alert("Gagal upload gambar! Cek console untuk detail.");
      }
    } catch (error) {
      console.error("Error upload detail:", error); // <--- Biar muncul detail error di console
      alert("Gagal upload! Cek console (F12) untuk detail error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Gambar Utama (Cover)</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {loading && <p className="text-blue-500 mt-2 text-sm">Sedang mengupload...</p>}

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-[200px] rounded-lg border shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
