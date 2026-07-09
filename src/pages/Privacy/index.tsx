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

export default function PrivacyPage({ initialContent }: { initialContent: any }) {
  return (
    <RootLayout>
      <CMSProvider collection="cms" docId="privacy" initialContent={initialContent}>
        <PrivacyWrapper />
      </CMSProvider>
    </RootLayout>
  );
}

export async function getServerSideProps() {
  const { getCms } = await import("@/lib/data");
  const initialContent = await getCms("privacy");
  return { props: { initialContent } };
}
