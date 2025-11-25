"use client";

import { useState, useRef } from "react";

export default function ImageUpload({ value, onChange, label = "Imagine produs" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validare tip fișier
    if (!file.type.startsWith("image/")) {
      setError("Te rugăm să selectezi o imagine (JPG, PNG, etc.)");
      return;
    }

    // Validare dimensiune (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Imaginea este prea mare. Dimensiunea maximă este 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    // Creează preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload la server
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Eroare la upload");
      }

      setPreview(result.url);
      onChange(result.url);
    } catch (err) {
      console.error("Eroare upload:", err);
      setError(err.message || "A apărut o eroare la încărcarea imaginii");
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex flex-col text-sm font-medium text-zinc-700">
        {label} *
        <div className="mt-2">
          {preview ? (
            <div className="relative">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2 top-2 rounded-full bg-rose-600 p-2 text-white transition hover:bg-rose-500"
                title="Șterge imaginea"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 transition hover:border-emerald-500 hover:bg-emerald-50/50"
            >
              <svg
                className="mb-3 h-12 w-12 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-semibold text-zinc-700">
                {uploading ? "Se încarcă..." : "Click pentru a selecta o imagine"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">JPG, PNG sau GIF (max 5MB)</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </label>
      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          <span>Se încarcă imaginea...</span>
        </div>
      )}
      {preview && !uploading && (
        <p className="text-xs text-zinc-500">
          Imagine încărcată cu succes. Poți continua cu salvarea produsului.
        </p>
      )}
    </div>
  );
}


