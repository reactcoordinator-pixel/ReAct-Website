"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";
import {
  Edit2,
  Save,
  X,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useCMS } from "@/contexts/CMSContext";

interface EditableTextProps {
  section: string;
  field: string;
  value: string;
  multiline?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export const EditableText: React.FC<EditableTextProps> = ({
  section,
  field,
  value,
  multiline = false,
  className = "",
  as: Component = "p",
}) => {
  const { isEditMode, updateContent } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    updateContent(section, field, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <Textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} border-2 border-yellow-400 bg-white`}
            autoFocus
            minRows={3}
          />
        ) : (
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} border-2 border-yellow-400 bg-white`}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2 absolute -bottom-12 left-0 z-50">
          <Button size="sm" color="success" onClick={handleSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button size="sm" color="danger" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} cursor-pointer hover:bg-yellow-100/30 hover:outline hover:outline-2 hover:outline-yellow-400 hover:outline-dashed rounded p-2 transition-all group relative`}
      onClick={() => setIsEditing(true)}
    >
      <Component className="m-0">{value}</Component>
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-400 rounded-full p-1">
        <Edit2 className="w-3 h-3 text-white" />
      </div>
    </div>
  );
};

interface EditableImageProps {
  section: string;
  field: string;
  value: string;
  alt?: string;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: string;
  helpText?: string;
  isBackground?: boolean;
}

interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  section,
  field,
  value,
  alt = "Image",
  className = "",
  maxWidth = 1920,
  maxHeight = 1080,
  aspectRatio = "16:9",
  helpText,
  isBackground = false,
}) => {
  const { isEditMode, updateContent } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalStats, setOriginalStats] = useState<{
    size: number;
    width: number;
    height: number;
  } | null>(null);
  const [compressedStats, setCompressedStats] = useState<{
    size: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const compressImage = async (
    file: File,
    options: CompressionOptions,
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const imgAspectRatio = width / height;

          if (width > options.maxWidth) {
            width = options.maxWidth;
            height = width / imgAspectRatio;
          }
          if (height > options.maxHeight) {
            height = options.maxHeight;
            width = height * imgAspectRatio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not create blob"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            options.quality,
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const smartCompress = async (file: File): Promise<File> => {
    const targetSizeMB = 4.5;
    let quality = 0.9;
    let compressedFile = file;
    let attempts = 0;
    const maxAttempts = 3;

    const originalUrl = URL.createObjectURL(file);
    const originalImg = await loadImage(originalUrl);
    setOriginalStats({
      size: file.size,
      width: originalImg.width,
      height: originalImg.height,
    });

    setCompressionProgress(10);

    while (attempts < maxAttempts) {
      compressedFile = await compressImage(file, {
        maxWidth,
        maxHeight,
        quality,
        maxSizeMB: targetSizeMB,
      });

      setCompressionProgress(30 + attempts * 20);

      if (compressedFile.size <= targetSizeMB * 1024 * 1024) {
        break;
      }

      quality -= 0.2;
      attempts++;
    }

    setCompressionProgress(80);

    const compressedUrl = URL.createObjectURL(compressedFile);
    const compressedImg = await loadImage(compressedUrl);
    setCompressedStats({
      size: compressedFile.size,
      width: compressedImg.width,
      height: compressedImg.height,
    });

    setCompressionProgress(100);
    return compressedFile;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setCompressionProgress(0);

    try {
      let fileToUpload = file;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > 4.5) {
        fileToUpload = await smartCompress(file);
      }

      const formData = new FormData();
      formData.append("image", fileToUpload);

      const res = await fetch(
        "https://www.uploads.reactmalaysia.org/api/upload-image.php",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      return data.url;
    } catch (error: any) {
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
      setCompressionProgress(0);
    }
  };

  const handleSave = () => {
    updateContent(section, field, tempValue);
    setIsOpen(false);
    resetState();
  };

  const handleClose = () => {
    setTempValue(value);
    setIsOpen(false);
    resetState();
  };

  const resetState = () => {
    setUploadError(null);
    setOriginalStats(null);
    setCompressedStats(null);
    setCompressionProgress(0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const url = await uploadImage(e.target.files[0]);
      setTempValue(url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // BACKGROUND IMAGE MODE
  if (isBackground) {
    if (!isEditMode) {
      return (
        <div
          className={className}
          style={{
            backgroundImage: `url('${value}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      );
    }

    return (
      <div
        className="relative w-full h-full group cursor-pointer"
        onClick={() => setIsOpen(true)} // Add click handler to entire area
      >
        {/* Background div */}
        <div
          className={`${className} transition-all duration-300`}
          style={{
            backgroundImage: `url('${tempValue || value}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Edit overlay - ALWAYS visible in edit mode, not just on hover */}
        <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-all duration-300 flex items-center justify-end">
          <Button
            size="lg"
            className="bg-yellow-400 text-white shadow-xl border-2 border-white/20"
            onClick={(e) => {
              e.stopPropagation(); // Prevent double trigger
              setIsOpen(true);
            }}
            startContent={<ImageIcon className="w-5 h-5" />}
          >
            Change Background Image
          </Button>
        </div>

        {/* Background Image Modal */}
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          size="2xl"
          scrollBehavior="inside"
          backdrop="blur"
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-yellow-500" />
                    <span>Update Background Image</span>
                  </div>
                </ModalHeader>

                <ModalBody className="gap-5">
                  {/* Requirements Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">
                          Background Image Requirements
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip size="sm" color="primary" variant="flat">
                            {maxWidth} × {maxHeight}px
                          </Chip>
                          <Chip size="sm" color="secondary" variant="flat">
                            {aspectRatio}
                          </Chip>
                          <Chip size="sm" color="success" variant="flat">
                            Max 5MB
                          </Chip>
                        </div>
                        {helpText && (
                          <p className="text-sm text-blue-700 mt-2">
                            {helpText}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Upload Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload New Background
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                        id={`bg-upload-${section}-${field}`}
                      />
                      <label
                        htmlFor={`bg-upload-${section}-${field}`}
                        className={`
                          flex items-center justify-center w-full h-32 
                          border-2 border-dashed border-gray-300 rounded-xl
                          cursor-pointer transition-all duration-200
                          hover:border-yellow-400 hover:bg-yellow-50
                          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload background image
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Dark images work best for text overlay
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Progress & Status */}
                  {isUploading && (
                    <div className="space-y-3">
                      {compressionProgress > 0 && compressionProgress < 100 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Compressing image...
                            </span>
                            <span className="text-yellow-600 font-medium">
                              {compressionProgress}%
                            </span>
                          </div>
                          <Progress
                            value={compressionProgress}
                            color="warning"
                            size="sm"
                            className="w-full"
                          />
                        </div>
                      )}

                      {compressionProgress === 100 && (
                        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                          <Spinner size="sm" color="warning" />
                          <span className="text-sm font-medium">
                            Uploading to server...
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-red-900 text-sm">
                          Upload Failed
                        </h5>
                        <p className="text-sm text-red-700 mt-1">
                          {uploadError}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Compression Stats */}
                  {(originalStats || compressedStats) && !isUploading && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Compression Complete
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {originalStats && (
                          <div>
                            <span className="text-gray-500">Original:</span>
                            <div className="font-medium text-gray-700">
                              {formatSize(originalStats.size)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {originalStats.width} × {originalStats.height}px
                            </div>
                          </div>
                        )}
                        {compressedStats && (
                          <div>
                            <span className="text-gray-500">Compressed:</span>
                            <div className="font-medium text-green-700">
                              {formatSize(compressedStats.size)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {compressedStats.width} × {compressedStats.height}
                              px
                            </div>
                          </div>
                        )}
                      </div>
                      {originalStats && compressedStats && (
                        <div className="text-xs text-green-700 font-medium">
                          Saved{" "}
                          {(
                            (1 - compressedStats.size / originalStats.size) *
                            100
                          ).toFixed(1)}
                          % file size
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview with Overlay */}
                  {tempValue && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Preview (with dark overlay)
                      </label>
                      <div className="relative rounded-xl overflow-hidden border-2 border-yellow-400 h-48">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${tempValue}')` }}
                        />
                        <div className="absolute inset-0 bg-black/70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-medium">
                            Preview with overlay
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>

                <ModalFooter className="gap-3">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleClose}
                    isDisabled={isUploading}
                    startContent={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    onPress={handleSave}
                    isDisabled={isUploading || !tempValue}
                    isLoading={isUploading}
                    startContent={!isUploading && <Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  // REGULAR IMAGE MODE
  const RemoteImage = ({
    src,
    className,
    alt,
  }: {
    src: string;
    className: string;
    alt: string;
  }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (error) {
      return (
        <div
          className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}
        >
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      );
    }

    return (
      <>
        {loading && (
          <div
            className={`${className} absolute inset-0 bg-gray-100 flex items-center justify-center z-10`}
          >
            <Spinner size="md" color="warning" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </>
    );
  };

  if (!isEditMode) {
    return (
      <div className="relative">
        <RemoteImage src={value} className={className} alt={alt} />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative">
        <RemoteImage
          src={tempValue || value}
          className={`${className} cursor-pointer hover:outline hover:outline-4 hover:outline-yellow-400 hover:outline-dashed transition-all`}
          alt={alt}
        />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          className="bg-yellow-400 text-white"
          onClick={() => setIsOpen(true)}
          isIconOnly
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Regular Image Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-500" />
                  <span>Update Image</span>
                </div>
              </ModalHeader>

              <ModalBody className="gap-5">
                {/* Requirements Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        Image Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Chip size="sm" color="primary" variant="flat">
                          {maxWidth} × {maxHeight}px
                        </Chip>
                        <Chip size="sm" color="secondary" variant="flat">
                          {aspectRatio}
                        </Chip>
                        <Chip size="sm" color="success" variant="flat">
                          Max 5MB
                        </Chip>
                      </div>
                      {helpText && (
                        <p className="text-sm text-blue-700 mt-2">{helpText}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload New Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                      id={`file-upload-${section}-${field}`}
                    />
                    <label
                      htmlFor={`file-upload-${section}-${field}`}
                      className={`
                        flex items-center justify-center w-full h-32 
                        border-2 border-dashed border-gray-300 rounded-xl
                        cursor-pointer transition-all duration-200
                        hover:border-yellow-400 hover:bg-yellow-50
                        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Progress & Status */}
                {isUploading && (
                  <div className="space-y-3">
                    {compressionProgress > 0 && compressionProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Compressing image...
                          </span>
                          <span className="text-yellow-600 font-medium">
                            {compressionProgress}%
                          </span>
                        </div>
                        <Progress
                          value={compressionProgress}
                          color="warning"
                          size="sm"
                          className="w-full"
                        />
                      </div>
                    )}

                    {compressionProgress === 100 && (
                      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                        <Spinner size="sm" color="warning" />
                        <span className="text-sm font-medium">
                          Uploading to server...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-red-900 text-sm">
                        Upload Failed
                      </h5>
                      <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                    </div>
                  </div>
                )}

                {/* Compression Stats */}
                {(originalStats || compressedStats) && !isUploading && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Compression Complete
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {originalStats && (
                        <div>
                          <span className="text-gray-500">Original:</span>
                          <div className="font-medium text-gray-700">
                            {formatSize(originalStats.size)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {originalStats.width} × {originalStats.height}px
                          </div>
                        </div>
                      )}
                      {compressedStats && (
                        <div>
                          <span className="text-gray-500">Compressed:</span>
                          <div className="font-medium text-green-700">
                            {formatSize(compressedStats.size)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {compressedStats.width} × {compressedStats.height}px
                          </div>
                        </div>
                      )}
                    </div>
                    {originalStats && compressedStats && (
                      <div className="text-xs text-green-700 font-medium">
                        Saved{" "}
                        {(
                          (1 - compressedStats.size / originalStats.size) *
                          100
                        ).toFixed(1)}
                        % file size
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Section */}
                {tempValue && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preview
                    </label>
                    <div className="relative rounded-xl overflow-hidden border-2 border-yellow-400 bg-gray-100">
                      <img
                        src={tempValue}
                        alt="Preview"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span>Ready to save</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="gap-3">
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                  isDisabled={isUploading}
                  startContent={<X className="w-4 h-4" />}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={handleSave}
                  isDisabled={isUploading || !tempValue}
                  isLoading={isUploading}
                  startContent={!isUploading && <Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

interface EditableLinkProps {
  section: string;
  field: string;
  index?: number;
  value: string;
  renderContent: (url: string) => React.ReactNode;
  helpText?: string; // Optional help text for the modal
}

export const EditableLink: React.FC<EditableLinkProps> = ({
  section,
  field,
  index,
  value,
  renderContent,
  helpText = "Enter the full embed URL from Facebook or Instagram",
}) => {
  const { isEditMode, updateContent, content } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    setIsSaving(true);

    if (index !== undefined) {
      const currentArray = content[section]?.[field];
      if (Array.isArray(currentArray)) {
        const newArray = [...currentArray];
        newArray[index] = tempValue;
        updateContent(section, field, newArray);
      }
    } else {
      updateContent(section, field, tempValue);
    }

    setIsSaving(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  if (!isEditMode) {
    return <>{renderContent(value)}</>;
  }

  return (
    <div className="relative group">
      <div
        className="cursor-pointer hover:outline hover:outline-4 hover:outline-yellow-400 hover:outline-dashed transition-all rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        {renderContent(value)}
      </div>

      {/* Edit Button Overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          className="bg-yellow-400 text-white shadow-lg"
          onClick={() => setIsOpen(true)}
          startContent={<Edit2 className="w-4 h-4" />}
        >
          Edit Link
        </Button>
      </div>

      {/* HeroUI Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-yellow-500" />
                  <span>Update Social Media Embed</span>
                </div>
              </ModalHeader>

              <ModalBody className="gap-5">
                {/* Help Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        How to get the embed URL
                      </h4>
                      <p className="text-sm text-blue-700">{helpText}</p>
                      <ul className="text-xs text-blue-600 mt-2 space-y-1 list-disc list-inside">
                        <li>Facebook: Click Share → Embed → Copy URL</li>
                        <li>Instagram: Use the embed code URL</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* URL Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Embed URL
                  </label>
                  <Textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="https://www.facebook.com/plugins/post.php?href=..."
                    className="w-full"
                    minRows={4}
                    description="Paste the full embed URL here"
                  />
                </div>

                {/* Preview Section */}
                {tempValue && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preview
                    </label>
                    <div className="relative rounded-xl overflow-hidden border-2 border-yellow-400 bg-gray-50 p-4">
                      <div className="text-xs text-gray-500 mb-2 break-all">
                        URL: {tempValue}
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden">
                        {renderContent(tempValue)}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="gap-3">
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                  isDisabled={isSaving}
                  startContent={<X className="w-4 h-4" />}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={handleSave}
                  isDisabled={!tempValue || isSaving}
                  isLoading={isSaving}
                  startContent={!isSaving && <Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

interface EditableObjectivesProps {
  section: string;
  field: string;
  objectives?: string[];
}

export const EditableObjectives: React.FC<EditableObjectivesProps> = ({
  section,
  field,
  objectives = [],
}) => {
  const { isEditMode, updateContent } = useCMS();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");

  // Ensure objectives is always an array
  const safeObjectives = Array.isArray(objectives) ? objectives : [];

  const handleEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setTempValue(value);
  };

  const handleSave = (index: number) => {
    const newObjectives = [...safeObjectives];
    newObjectives[index] = tempValue;
    updateContent(section, field, newObjectives);
    setEditingIndex(null);
  };

  const handleAdd = () => {
    const newObjectives = [
      ...safeObjectives,
      `${safeObjectives.length + 1}. NEW OBJECTIVE`,
    ];
    updateContent(section, field, newObjectives);
  };

  const handleDelete = (index: number) => {
    if (safeObjectives.length <= 1) {
      alert("You must have at least one objective");
      return;
    }
    const newObjectives = safeObjectives.filter((_, i) => i !== index);
    updateContent(section, field, newObjectives);
  };

  // Handle empty objectives
  if (safeObjectives.length === 0) {
    if (isEditMode) {
      return (
        <div className="space-y-4">
          <p className="text-gray-500">
            No objectives yet. Click below to add one.
          </p>
          <Button
            onClick={handleAdd}
            className="bg-yellow-400"
            startContent={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Objective
          </Button>
        </div>
      );
    }
    return <div className="text-gray-500">No objectives available</div>;
  }

  if (!isEditMode) {
    return (
      <>
        <div className="flex text-left flex-wrap wrap md:justify-evenly">
          {safeObjectives.slice(0, 3).map((obj, index) => (
            <div key={index}>{obj}</div>
          ))}
        </div>
        {safeObjectives.length > 3 && (
          <div className="flex flex-wrap wrap md:justify-evenly md:mt-6">
            {safeObjectives.slice(3).map((obj, index) => (
              <div key={index + 3}>{obj}</div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeObjectives.map((obj, index) => (
          <div key={index} className="relative group">
            {editingIndex === index ? (
              <div className="bg-white p-3 rounded border-2 border-yellow-400">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => handleSave(index)}
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => setEditingIndex(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleEdit(index, obj)}
                className="cursor-pointer hover:bg-yellow-100/30 hover:outline hover:outline-2 hover:outline-yellow-400 hover:outline-dashed rounded p-3 transition-all"
              >
                {obj}
              </div>
            )}
            {editingIndex !== index && (
              <button
                onClick={() => handleDelete(index)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleAdd}
        className="bg-yellow-400"
        startContent={<Plus className="w-4 h-4" />}
        size="sm"
      >
        Add Objective
      </Button>
    </div>
  );
};
