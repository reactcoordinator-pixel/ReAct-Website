"use client";

import { useState, useEffect } from "react";

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

export const useNavigation = () => {
  const [data, setData] = useState<NavigationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/cms/navigation");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data: fetched } = (await res.json()) as { data: NavigationData };
        if (fetched) {
          fetched.navigationLinks = (fetched.navigationLinks || [])
            .map((l, i) => ({ ...l, order: l.order ?? i + 1 }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setData(fetched);
        } else {
          setData(fallbackData);
        }
      } catch (e) {
        console.error(e);
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateNavigation = async (newData: NavigationData) => {
    try {
      const res = await fetch("/api/cms/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(newData);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return { data, isLoading, updateNavigation, fallbackData };
};