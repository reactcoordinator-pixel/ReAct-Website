// app/contact/page.tsx (or pages/contact.tsx - Public Contact Page)
"use client";

import RootLayout from "@/components/RootLayout";
import { CMSProvider } from "@/contexts/CMSContext";
import Contact from "@/components/Contact";
import { Spinner } from "@heroui/react";
import { useCMS } from "@/contexts/CMSContext";

export default function ContactPage() {
  return (
    <RootLayout>
      <CMSProvider collection="cms" docId="contact">
        <ContactWrapper />
      </CMSProvider>
    </RootLayout>
  );
}

const ContactWrapper = () => {
  const { isLoading, isReady } = useCMS();

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return <Contact />;
};
