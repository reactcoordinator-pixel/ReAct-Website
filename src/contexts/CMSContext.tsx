// contexts/CMSContext.tsx (Updated to support multiple documents)
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/pages/api/FirebaseConfig"; // Adjust path if needed

interface CMSContextType {
  isEditMode: boolean;
  content: any;
  updateContent: (section: string, field: string, value: any) => void;
  saveChanges: () => Promise<void>;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within CMSProvider");
  }
  return context;
};

export const CMSProvider: React.FC<{
  children: React.ReactNode;
  editMode?: boolean;
  collection?: string;
  docId?: string;
}> = ({
  children,
  editMode = false,
  collection = "cms",
  docId = "homepage",
}) => {
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [content, setContent] = useState<any>(null);
  const [originalContent, setOriginalContent] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadContent();
  }, [collection, docId]);

  useEffect(() => {
    setIsEditMode(editMode);
  }, [editMode]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const loadedContent = docSnap.data();
        setContent(loadedContent);
        setOriginalContent(JSON.parse(JSON.stringify(loadedContent)));
        setIsReady(true);
      } else {
        setError(`No CMS data found for ${collection}/${docId}`);
        setIsReady(false);
      }
    } catch (err) {
      console.error("Error loading content:", err);
      setError("Failed to load content.");
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = (section: string, field: string, value: any) => {
    setContent((prev: any) => {
      if (!prev) return prev;
      const newContent = JSON.parse(JSON.stringify(prev));

      if (!newContent[section]) {
        newContent[section] = {};
      }

      if (field.includes(".")) {
        const parts = field.split(".");
        let current = newContent[section];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        newContent[section][field] = value;
      }

      return newContent;
    });
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    try {
      const docRef = doc(db, collection, docId);
      await setDoc(docRef, content);
      setOriginalContent(JSON.parse(JSON.stringify(content)));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      throw error;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        isEditMode,
        content,
        updateContent,
        saveChanges,
        hasUnsavedChanges,
        isLoading,
        error,
        isReady,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};
