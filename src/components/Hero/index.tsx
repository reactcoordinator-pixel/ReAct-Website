// components/Hero.tsx
"use client";
import { useEffect, useState } from "react";
import { Link, Button } from "@heroui/react";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText } from "@/components/CMS/EditableField";
import { Image as ImageIcon } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";
import { AlertCircle, Upload, CheckCircle2, Save, X } from "lucide-react";

// Background Image Editor Component
const BackgroundImageEditor = ({
  value,
  onSave,
  isOpen,
  onClose,
}: {
  value: string;
  onSave: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [tempValue, setTempValue] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalStats, setOriginalStats] = useState<any>(null);
  const [compressedStats, setCompressedStats] = useState<any>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value, isOpen]);

  const compressImage = async (file: File): Promise<File> => {
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
          const aspectRatio = width / height;
          if (width > 1920) {
            width = 1920;
            height = width / aspectRatio;
          }
          if (height > 1080) {
            height = 1080;
            width = height * aspectRatio;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("No blob"));
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }),
              );
            },
            "image/jpeg",
            0.9,
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setCompressionProgress(10);

    try {
      let fileToUpload = file;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > 4.5) {
        setCompressionProgress(30);
        fileToUpload = await compressImage(file);
        setCompressionProgress(80);
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
      if (!res.ok || !data.success)
        throw new Error(data.error || "Upload failed");

      setCompressionProgress(100);
      return data.url;
    } catch (error: any) {
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
    }
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

  const handleSave = () => {
    onSave(tempValue);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                        1920 × 1080px
                      </Chip>
                      <Chip size="sm" color="secondary" variant="flat">
                        16:9
                      </Chip>
                      <Chip size="sm" color="success" variant="flat">
                        Max 5MB
                      </Chip>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Dark images work best for text readability
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

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
                    id="hero-bg-upload"
                  />
                  <label
                    htmlFor="hero-bg-upload"
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
                    </div>
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-yellow-600 font-medium">
                      {compressionProgress}%
                    </span>
                  </div>
                  <Progress
                    value={compressionProgress}
                    color="warning"
                    size="sm"
                  />
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}

              {(originalStats || compressedStats) && !isUploading && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Compression Complete
                  </div>
                </div>
              )}

              {tempValue && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preview
                  </label>
                  <div className="relative rounded-xl overflow-hidden border-2 border-yellow-400 h-48">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${tempValue}')` }}
                    />
                    <div className="absolute inset-0 bg-black/70" />
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      Preview with overlay
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="gap-3">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                startContent={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onPress={handleSave}
                isDisabled={isUploading || !tempValue}
                isLoading={isUploading}
                startContent={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Hero = () => {
  const { content, isLoading, isReady, isEditMode, updateContent } = useCMS();
  const [index, setIndex] = useState(0);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
    return () => clearTimeout(intervalId);
  }, []);

  const heroContent = content.hero;

  return (
    <>
      <section className="relative h-[440px] lg:h-[580px] w-full text-white tracking-wider overflow-hidden">
        {/* Background Image - NOT editable directly anymore */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroContent.backgroundImage}')` }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10" />

        {/* Content Layer - z-20, pointer-events-auto */}
        <div className="relative z-20 flex items-center h-full">
          <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0 w-full">
            <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
              <div className="md:w-2/3 p-8 rounded-lg">
                {/* Edit Background Button - ONLY in edit mode, positioned in content area */}
                {isEditMode && (
                  <div className="mb-6">
                    <Button
                      color="warning"
                      variant="solid"
                      onClick={() => setIsBgModalOpen(true)}
                      startContent={<ImageIcon className="w-4 h-4" />}
                      className="bg-yellow-400 text-black font-semibold"
                    >
                      Change Background Image
                    </Button>
                  </div>
                )}

                <EditableText
                  section="hero"
                  field="subtitle"
                  value={heroContent.subtitle}
                  as="h2"
                  className="mb-4.5 text-white text-xs md:text-base font-medium"
                />

                <h1 className="mb-5 pr-16 text-3xl font-bold text-white xl:text-hero">
                  <EditableText
                    section="hero"
                    field="title"
                    value={heroContent.title}
                    as="span"
                    className="inline text-white"
                  />{" "}
                  <EditableText
                    section="hero"
                    field="titleHighlight"
                    value={heroContent.titleHighlight}
                    as="span"
                    className="inline text-[#f8cf2c]"
                  />
                </h1>

                <EditableText
                  section="hero"
                  field="description"
                  value={heroContent.description}
                  as="p"
                  className="text-white text-xs md:text-base"
                  multiline
                />

                <div className="mt-8">
                  {isEditMode ? (
                    <div className="inline-block">
                      <EditableText
                        section="hero"
                        field="buttonText"
                        value={heroContent.buttonText}
                        as="span"
                        className="flex px-10 py-2.5 text-sm md:text-base rounded-full bg-[#f8cf2c] border-[#f8cf2c] border-2 text-[#000] cursor-not-allowed opacity-75"
                      />
                    </div>
                  ) : (
                    <Link href={"/AboutUs"}>
                      <button
                        aria-label="get started button"
                        className="flex px-5 py-2.5 text-sm md:text-base rounded-full bg-[#f8cf2c] border-[#f8cf2c] border-2 md:px-12 md:py-2.5 text-[#000] duration-300 ease-in-out hover:bg-transparent hover:text-[#f8cf2c]"
                      >
                        {heroContent.buttonText}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Image Editor Modal - Outside the z-index hierarchy */}
      <BackgroundImageEditor
        value={heroContent.backgroundImage}
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        onSave={(url) => updateContent("hero", "backgroundImage", url)}
      />
    </>
  );
};

export default Hero;
