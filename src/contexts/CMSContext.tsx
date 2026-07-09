// contexts/CMSContext.tsx — Supabase-backed CMS content (via /api/cms/[id])
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
  /** SSR-provided content — when set, renders instantly with no client fetch/skeleton. */
  initialContent?: any;
}> = ({
  children,
  editMode = false,
  collection = "cms",
  docId = "homepage",
  initialContent,
}) => {
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [content, setContent] = useState<any>(initialContent ?? null);
  const [originalContent, setOriginalContent] = useState<any>(
    initialContent ? JSON.parse(JSON.stringify(initialContent)) : null,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(!!initialContent);

  useEffect(() => {
    // If content was provided by the server, skip the client fetch entirely.
    if (initialContent) return;
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  useEffect(() => {
    setIsEditMode(editMode);
  }, [editMode]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/cms/${docId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data } = await res.json();

      if (data) {
        setContent(data);
        setOriginalContent(JSON.parse(JSON.stringify(data)));
        setIsReady(true);
      } else {
        setError(`No CMS data found for ${docId}`);
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
      const res = await fetch(`/api/cms/${docId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: content }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
