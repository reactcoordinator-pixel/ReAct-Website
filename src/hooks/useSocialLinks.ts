// hooks/useSocialLinks.ts
"use client";
import useSWR from "swr";

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

const fetchSocialLinks = async (url: string): Promise<SocialLinksData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = (await res.json()) as { data: SocialLinksData };
  if (!data) throw new Error("No social links found");
  return data;
};

export const useSocialLinks = () => {
  // SWR caches globally and keyed by URL, so the Header remounting on every
  // client navigation serves the cached value instantly — no skeleton reflash.
  const { data, isLoading, error, mutate } = useSWR<SocialLinksData>(
    "/api/cms/socialLinks",
    fetchSocialLinks,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    },
  );

  const updateSocialLinks = async (newData: SocialLinksData) => {
    try {
      const res = await fetch("/api/cms/socialLinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await mutate(newData, { revalidate: false });
      return true;
    } catch (err) {
      console.error("Error saving:", err);
      return false;
    }
  };

  return {
    data: data ?? null,
    isLoading,
    error: error ? "Failed to load social links" : null,
    refetch: () => mutate(),
    updateSocialLinks,
  };
};