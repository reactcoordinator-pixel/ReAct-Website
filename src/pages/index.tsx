// pages/index.tsx (Updated with page-level skeleton loading)
"use client";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import MissionAndVision from "@/components/MissionAndVision";
import FAQ from "@/components/FAQ";
import Contribute from "@/components/Contribute";
import BlogsListing from "@/components/BlogsListing";
import Services from "@/components/Services";
import { Button, Link, Skeleton } from "@heroui/react";
import FacebookPost from "@/components/Facebook";
import RootLayout from "@/components/RootLayout";
import { CMSProvider, useCMS } from "@/contexts/CMSContext";

const HomeSkeleton = () => (
  <div className="animate-pulse space-y-20 pb-20">
    {/* Hero Section Skeleton */}
    <section className="relative h-[440px] lg:h-[580px] w-full overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 bg-black/50" />
    </section>

    {/* Introduction / Mission / Services Skeleton */}
    <div className="space-y-20 px-4 md:px-8">
      <div className="text-center space-y-6">
        <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
        <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
        <Skeleton className="h-32 w-full max-w-4xl mx-auto rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Blogs Section */}
      <div className="space-y-8">
        <Skeleton className="h-10 w-80 mx-auto rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 w-full rounded-2xl" />
          ))}
        </div>
        <div className="text-center">
          <Skeleton className="h-12 w-64 mx-auto rounded-full" />
        </div>
      </div>

      {/* Facebook + Contribute + FAQ placeholders */}
      <Skeleton className="h-96 w-full rounded-2xl" />
      <Skeleton className="h-80 w-full max-w-4xl mx-auto rounded-2xl" />
      <div className="space-y-8">
        <Skeleton className="h-10 w-72 mx-auto rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomeContent = () => {
  const { isLoading } = useCMS();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <main className="backdrop-blur-sm">
      <section className="relative">
        <Hero />
      </section>
      <Introduction />
      <MissionAndVision />
      <Services all={true} />
      <div className="my-14">
        <BlogsListing all={undefined} category={undefined} />
        <div className="flex justify-center">
          <Button size="md" className="bg-[#f8cf2c] text-white">
            <Link className="text-white" href="/blogs">
              View All Blogs
            </Link>
          </Button>
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
  );
};

export default function Home() {
  return (
    <CMSProvider editMode={false}>
      <RootLayout>
        <HomeContent />
      </RootLayout>
    </CMSProvider>
  );
}
