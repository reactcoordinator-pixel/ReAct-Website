"use client";

import { useState, useRef } from "react";
import { Button, Progress, Spinner } from "@heroui/react";
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DropzoneButton({
  handleImage,
  defaultValue,
}: {
  handleImage: (url: string | null) => void;
  defaultValue: string | null;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValue || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (
    file: File,
    { maxWidth, maxHeight, quality }: { maxWidth: number; maxHeight: number; quality: number }
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context failed"));

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Blob creation failed"));
              const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
              });
              resolve(compressed);
            },
            "image/jpeg",
            quality
          );
        };
        img.src = e.target?.result as string;
        img.onerror = () => reject(new Error("Image load failed"));
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(file);
    });
  };

  const smartCompress = async (file: File): Promise<File> => {
    let compressed = file;
    let quality = 0.92;
    const maxAttempts = 5;
    let attempts = 0;

    setProgress(20);

    while (compressed.size > 4 * 1024 * 1024 && attempts < maxAttempts) {
      compressed = await compressImage(compressed, {
        maxWidth: 2500,
        maxHeight: 2500,
        quality,
      });
      quality -= 0.1;
      attempts++;
      setProgress(20 + attempts * 12);
    }
    setProgress(70);
    return compressed;
  };

  const handleFiles = async (files: File[]) => {
    const file = files.find((f) => f.type === "image/jpeg" || f.type === "image/png");
    if (!file) {
      toast.error("Please select a valid image (PNG or JPEG)");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    const previousUrl = imageUrl;

    setPreviewUrl(localUrl);
    setUploading(true);
    setProgress(0);
    setError(null);

    let currentLocalUrl = localUrl;

    try {
      let fileToUpload = file;

      if (file.size > 5 * 1024 * 1024) {
        fileToUpload = await smartCompress(file);
      }

      const formData = new FormData();
      formData.append("image", fileToUpload);

      setProgress(80);

      const res = await fetch("https://www.uploads.reactmalaysia.org/api/upload-image.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setProgress(100);

      const remoteUrl = data.url;
      setImageUrl(remoteUrl);
      setPreviewUrl(remoteUrl);
      handleImage(remoteUrl);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setPreviewUrl(previousUrl);
      toast.error("Image upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
      if (currentLocalUrl && previewUrl !== currentLocalUrl && currentLocalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentLocalUrl);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = () => {
    setImageUrl(null);
    setPreviewUrl(null);
    handleImage(null);
    setError(null);
    setProgress(0);
    toast.success("Image removed");
  };

  const openFilePicker = () => inputRef.current?.click();

  return (
    <div className="w-full space-y-6">
      {error && !previewUrl && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Upload failed</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!previewUrl && (
        <>
          <div
            className={`relative flex flex-col items-center justify-center w-full h-96 border-2 rounded-xl transition-all cursor-pointer ${
              dragActive
                ? "border-yellow-400 bg-yellow-50"
                : "border-dashed border-gray-300 bg-gray-50"
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleDrop}
            onClick={openFilePicker}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleChange}
              className="hidden"
            />

            {dragActive ? (
              <CheckCircle2 className="w-16 h-16 text-yellow-600 mb-4" />
            ) : (
              <Upload className="w-16 h-16 text-[#6f1d1b] mb-4" />
            )}

            <p className="text-xl font-semibold text-[#6f1d1b]">
              {dragActive ? "Drop image here" : "Upload Image"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPEG • Max 30MB
            </p>
          </div>

          <Button
            size="lg"
            className="w-full bg-[#6f1d1b] text-white font-medium"
            onPress={openFilePicker}
          >
            Select File
          </Button>
        </>
      )}

      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={previewUrl}
            alt="Project cover image"
            className="w-full h-auto object-cover block"
            onError={() => {
              setError("Failed to load image");
              setPreviewUrl(null);
              toast.error("Image failed to load");
            }}
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" color="warning" />
              <p className="text-white text-lg font-medium">Uploading image...</p>
              <Progress value={progress} color="warning" className="w-80" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-red-600/80 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <AlertCircle className="w-12 h-12 text-white" />
              <p className="text-white text-lg font-medium">
                Upload failed: {error}
              </p>
              <p className="text-white text-sm">Delete and try again</p>
            </div>
          )}

          <Button
            isIconOnly
            color="danger"
            size="lg"
            className="absolute top-4 right-4 z-10 shadow-lg"
            onPress={handleDelete}
            isDisabled={uploading}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}