"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Save, Eye, AlertCircle } from "lucide-react";
import { CMSProvider, useCMS } from "@/contexts/CMSContext";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { Spinner } from "@heroui/react";

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
            <span className="font-bold text-sm">EDIT MODE</span>
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
            Hover over any text to edit
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
            href="/privacy"
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

const AdminPrivacyContent = () => {
  const { isLoading } = useCMS();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <>
      <CMSToolbar />
      <div className="mt-16">
        <PrivacyPolicy />
      </div>
    </>
  );
};

export default function AdminPrivacyPage() {
  return (
    <CMSProvider collection="cms" docId="privacy" editMode={true}>
      <AdminPrivacyContent />
    </CMSProvider>
  );
}
