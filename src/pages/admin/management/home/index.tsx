// pages/admin/management/home.tsx
"use client";
import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Save, Eye, EyeOff, AlertCircle } from "lucide-react";
import { CMSProvider, useCMS } from "@/contexts/CMSContext";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import MissionAndVision from "@/components/MissionAndVision";
import FacebookPost from "@/components/Facebook";
import Contribute from "@/components/Contribute";
import FAQ from "@/components/FAQ";
import { LoadingWrapper } from "@/components/CMS/LoadingWrapper";

const CMSToolbar = () => {
  const { saveChanges, hasUnsavedChanges, isLoading } = useCMS();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 shadow-lg z-[9998]">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1 rounded-lg">
            <span className="font-bold text-sm"> EDIT MODE</span>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Unsaved Changes</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">
            Hover over any text or image to edit
          </span>
          <Button
            color="success"
            onClick={handleSave}
            isLoading={isSaving}
            startContent={!isSaving && <Save className="w-4 h-4" />}
            className="font-semibold"
            size="sm"
          >
            {isSaving ? "Publishing..." : "Publish Changes"}
          </Button>
          <Button
            color="default"
            as="a"
            href="/"
            target="_blank"
            size="sm"
            startContent={<Eye className="w-4 h-4" />}
          >
            Preview Live Site
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminHomeContent = () => {
  return (
    <>
      <LoadingWrapper>
        <CMSToolbar />
        <main className="backdrop-blur-sm mt-16">
          <section className="relative">
            <Hero />
          </section>
          <Introduction />
          <MissionAndVision />

          {/* Note about other components */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-8 mx-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Services and Blog Listing components
                  can be edited from their respective CMS panel settings.
                </p>
              </div>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#ededed"
              fillOpacity="1"
              d="M0,64L80,58.7C160,53,320,43,480,80C640,117,800,203,960,197.3C1120,192,1280,96,1360,48L1440,0L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>

          <FacebookPost />

          <div className="my-14">
            <Contribute />
          </div>

          <FAQ />
        </main>
      </LoadingWrapper>
    </>
  );
};

export default function AdminHomePage() {
  return (
    <CMSProvider editMode={true}>
      <AdminHomeContent />
    </CMSProvider>
  );
}
