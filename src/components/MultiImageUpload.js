"use client";

import { useState, useRef } from "react";

export default function MultiImageUpload({ value = [], onChange, label = "Imagini produs" }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [previews, setPreviews] = useState(value || []);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validare tip fișier
    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      setError("Te rugăm să selectezi doar imagini (JPG, PNG, etc.)");
      return;
    }

    // Validare dimensiune (max 5MB per fișier)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Unele imagini sunt prea mari. Dimensiunea maximă este 5MB per imagine");
      return;
    }

    setError(null);
    setUploading(true);

    // Creează preview-uri locale
    const newPreviews = [...previews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // Upload fiecare fișier
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      setUploadingIndex(i);
      try {
        const formData = new FormData();
        formData.append("file", files[i]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Eroare la upload");
        }

        uploadedUrls.push(result.url);
      } catch (err) {
        console.error("Eroare upload:", err);
        setError(err.message || "A apărut o eroare la încărcarea unei imagini");
        // Elimină preview-ul local dacă upload-ul a eșuat
        newPreviews.pop();
        setPreviews([...newPreviews]);
      }
    }

    // Actualizează lista finală de imagini
    const finalImages = [...previews, ...uploadedUrls];
    setPreviews(finalImages);
    onChange(finalImages);
    setUploading(false);
    setUploadingIndex(null);

    // Resetează input-ul
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index) => {
    const newImages = previews.filter((_, i) => i !== index);
    setPreviews(newImages);
    onChange(newImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...previews];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setPreviews(newImages);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <label className="flex flex-col text-sm font-medium text-zinc-700">
        {label} *
        <div className="mt-2">
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                    <img
                      src={preview}
                      alt={`Imagine ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                        Principală
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleReorder(index, index - 1)}
                        className="rounded-full bg-white/90 p-2 text-zinc-800 transition hover:bg-white"
                        title="Mută în stânga"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="rounded-full bg-rose-600 p-2 text-white transition hover:bg-rose-500"
                      title="Șterge imaginea"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index < previews.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleReorder(index, index + 1)}
                        className="rounded-full bg-white/90 p-2 text-zinc-800 transition hover:bg-white"
                        title="Mută în dreapta"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 transition hover:border-emerald-500 hover:bg-emerald-50/50"
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
              {uploading ? "Se încarcă..." : "Click pentru a adăuga imagini"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              JPG, PNG sau GIF (max 5MB per imagine). Prima imagine va fi cea principală.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          <span>
            Se încarcă imaginea {uploadingIndex !== null ? `${uploadingIndex + 1}` : ""}...
          </span>
        </div>
      )}
      {previews.length > 0 && !uploading && (
        <p className="text-xs text-zinc-500">
          {previews.length} {previews.length === 1 ? "imagine încărcată" : "imagini încărcate"}. Poți adăuga mai multe.
        </p>
      )}
    </div>
  );
}



