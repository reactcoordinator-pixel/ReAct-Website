// hooks/useSocialLinks.ts
"use client";
import { useState, useEffect } from "react";

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  showInHeader: boolean;
  showInFooter: boolean;
  order: number;
}

export interface SocialLinksData {
  links: SocialLink[];
  email: {
    address: string;
    showInHeader: boolean;
  };
}

export const useSocialLinks = () => {
  const [data, setData] = useState<SocialLinksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cms/socialLinks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data } = (await res.json()) as { data: SocialLinksData };
      if (data) {
        setData(data);
      } else {
        setError("No social links found");
      }
    } catch (err) {
      setError("Failed to load social links");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSocialLinks = async (newData: SocialLinksData) => {
    try {
      const res = await fetch("/api/cms/socialLinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(newData);
      return true;
    } catch (err) {
      console.error("Error saving:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSocialLinks,
    updateSocialLinks,
  };
};