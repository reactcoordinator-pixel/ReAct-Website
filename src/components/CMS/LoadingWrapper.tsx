// components/CMS/LoadingWrapper.tsx
"use client";
import { useCMS } from "@/contexts/CMSContext";
import { Spinner, Button } from "@heroui/react";
import { AlertCircle } from "lucide-react";

export const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, error, isReady } = useCMS();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" color="warning" />
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Content
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Content Not Ready
          </h2>
          <p className="text-gray-600">
            Please run the migration script to populate the database.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
