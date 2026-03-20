// hooks/useSocialLinks.ts
"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/pages/api/FirebaseConfig";

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
      const docRef = doc(db, "cms", "socialLinks");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setData(docSnap.data() as SocialLinksData);
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
      const docRef = doc(db, "cms", "socialLinks");
      await setDoc(docRef, newData);
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