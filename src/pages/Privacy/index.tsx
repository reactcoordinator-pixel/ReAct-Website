"use client";

import RootLayout from "@/components/RootLayout";
import { CMSProvider, useCMS } from "@/contexts/CMSContext";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { Spinner } from "@heroui/react";

const PrivacyWrapper = () => {
  const { isLoading } = useCMS();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return <PrivacyPolicy />;
};

export default function PrivacyPage() {
  return (
    <RootLayout>
      <CMSProvider collection="cms" docId="privacy">
        <PrivacyWrapper />
      </CMSProvider>
    </RootLayout>
  );
}
