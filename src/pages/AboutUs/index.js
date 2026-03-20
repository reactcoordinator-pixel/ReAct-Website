// pages/AboutUs.tsx (Updated with skeleton)
"use client";
import { CMSProvider, useCMS } from "@/contexts/CMSContext";
import AboutUs from "@/components/AboutUs"; // Renamed to avoid name conflict
import RootLayout from "@/components/RootLayout";
import { Skeleton } from "@heroui/react";

const AboutUsSkeleton = () => (
  <div className="animate-pulse space-y-16 pb-20">
    <Skeleton className="w-full h-[300px] rounded-none" />

    <div className="text-center space-y-6">
      <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
      <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
    </div>

    <div className="space-y-12 px-4 md:px-8">
      <Skeleton className="h-40 w-full max-w-4xl mx-auto rounded-lg" />
      <Skeleton className="w-full h-96 rounded-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>

      <div className="text-center space-y-6">
        <Skeleton className="h-10 w-80 mx-auto rounded-lg" />
        <Skeleton className="h-80 w-full max-w-5xl mx-auto rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

const AboutUsContent = () => {
  const { isLoading } = useCMS();

  if (isLoading) {
    return <AboutUsSkeleton />;
  }

  return <AboutUs />;
};

export default function AboutUsPage() {
  return (
    <CMSProvider editMode={false}>
      <AboutUsContent />
    </CMSProvider>
  );
}
