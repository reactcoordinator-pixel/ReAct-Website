"use client";

import useSWR from "swr";

export interface NavLink {
  label: string;
  href: string;
  visible: boolean;
  order?: number;
}

export interface NavigationData {
  logo: string;
  navigationLinks: NavLink[];
  footerQuickLinks: NavLink[];
  footerSupportLinks: NavLink[];
  footerBottomLinks: NavLink[];
  copyright: string;
}

const fallbackData: NavigationData = {
  logo: "/logo.png",
  navigationLinks: [
    { label: "Home", href: "/", visible: true, order: 1 },
    { label: "About", href: "/AboutUs", visible: true, order: 2 },
    { label: "Projects", href: "/services", visible: true, order: 3 },
    { label: "News & Blogs", href: "/blogs", visible: true, order: 4 },
    { label: "Contact", href: "/ContactUs", visible: true, order: 5 },
  ],
  footerQuickLinks: [
    { label: "Home", href: "/", visible: true },
    { label: "Projects", href: "/services", visible: true },
    { label: "FAQ's", href: "/FAQs", visible: true },
  ],
  footerSupportLinks: [
    { label: "Blogs", href: "/blogs", visible: true },
    { label: "About Us", href: "/AboutUs", visible: true },
    { label: "Contact Us", href: "/ContactUs", visible: true },
  ],
  footerBottomLinks: [
    { label: "Privacy Policy", href: "/privacy", visible: true },
    { label: "Contact", href: "/ContactUs", visible: true },
  ],
  copyright: `© ${new Date().getFullYear()} ReAct. All rights reserved`,
};

// Fetch on failure resolves to the fallback so the navbar always renders.
const fetchNavigation = async (url: string): Promise<NavigationData> => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data: fetched } = (await res.json()) as { data: NavigationData };
    if (!fetched) return fallbackData;
    fetched.navigationLinks = (fetched.navigationLinks || [])
      .map((l, i) => ({ ...l, order: l.order ?? i + 1 }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return fetched;
  } catch (e) {
    console.error(e);
    return fallbackData;
  }
};

export const useNavigation = () => {
  // SWR caches globally and keyed by URL, so the Header remounting on every
  // client navigation serves the cached value instantly — no skeleton reflash.
  const { data, isLoading, mutate } = useSWR<NavigationData>(
    "/api/cms/navigation",
    fetchNavigation,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    },
  );

  const updateNavigation = async (newData: NavigationData) => {
    try {
      const res = await fetch("/api/cms/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await mutate(newData, { revalidate: false });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return { data: data ?? null, isLoading, updateNavigation, fallbackData };
};