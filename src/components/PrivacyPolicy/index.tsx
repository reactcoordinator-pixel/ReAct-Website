// components/PrivacyPolicy/PrivacyPolicy.tsx (Fully Fixed Version)
"use client";

import React from "react";
import { Divider, Card, CardBody, Button } from "@heroui/react";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText } from "@/components/CMS/EditableField";
import { Plus, Trash2 } from "lucide-react";

const PrivacyPolicy = () => {
  const { content, isEditMode, updateContent } = useCMS();
  const privacy = content || {};

  // Helper to add new definition (object with term + desc)
  const addDefinition = () => {
    const newDefs = [
      ...(privacy.interpretation?.definitions || []),
      { term: "New Term", desc: "New description" },
    ];
    updateContent("interpretation", "definitions", newDefs);
  };

  // Helper to delete definition
  const deleteDefinition = (index: number) => {
    const newDefs = (privacy.interpretation?.definitions || []).filter(
      (_: any, i: number) => i !== index,
    );
    updateContent("interpretation", "definitions", newDefs);
  };

  // Helper to add personal data item (simple string)
  const addPersonalDataItem = () => {
    const newItems = [
      ...(privacy.dataCollection?.personalDataItems || []),
      "New item",
    ];
    updateContent("dataCollection", "personalDataItems", newItems);
  };

  // Helper to delete personal data item
  const deletePersonalDataItem = (index: number) => {
    const newItems = (privacy.dataCollection?.personalDataItems || []).filter(
      (_: any, i: number) => i !== index,
    );
    updateContent("dataCollection", "personalDataItems", newItems);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 bg-white text-black min-h-screen">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Privacy Policy - ReAct
        </h1>
        <EditableText
          section=""
          field="lastUpdated"
          value={privacy.lastUpdated || "February 09, 2026"}
          as="p"
          className="text-sm text-gray-600"
        />
      </header>

      <section className="space-y-8 text-black leading-relaxed">
        <EditableText
          section=""
          field="introduction"
          value={privacy.introduction || ""}
          as="p"
          multiline
        />

        <Divider className="bg-black/10" />

        {/* Interpretation and Definitions */}
        <section>
          <EditableText
            section="interpretation"
            field="title"
            value={privacy.interpretation?.title || ""}
            as="h2"
            className="text-2xl font-bold mb-4"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 italic">
                Interpretation
              </h3>
              <EditableText
                section="interpretation"
                field="interpretationText"
                value={privacy.interpretation?.interpretationText || ""}
                as="p"
                multiline
              />
            </div>

            <div>
              <EditableText
                section="interpretation"
                field="definitionsTitle"
                value={privacy.interpretation?.definitionsTitle || ""}
                as="h3"
                className="text-xl font-semibold mb-4 italic"
              />

              {/* Editable Definitions List */}
              <ul className="space-y-6 list-none">
                {(privacy.interpretation?.definitions || []).map(
                  (item: { term: string; desc: string }, i: number) => (
                    <li
                      key={i}
                      className="border-l-2 border-black pl-4 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <EditableText
                            section="interpretation"
                            field={`definitions.${i}.term`}
                            value={item.term || ""}
                            className="block mb-1"
                          />
                          <EditableText
                            section="interpretation"
                            field={`definitions.${i}.desc`}
                            value={item.desc || ""}
                            as="span"
                            className="text-sm block"
                            multiline
                          />
                        </div>

                        {isEditMode && (
                          <button
                            onClick={() => deleteDefinition(i)}
                            className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </li>
                  ),
                )}
              </ul>

              {isEditMode && (
                <Button
                  onClick={addDefinition}
                  size="sm"
                  className="mt-6 bg-[#f8cf2c] text-white"
                  startContent={<Plus className="w-4 h-4" />}
                >
                  Add New Definition
                </Button>
              )}
            </div>
          </div>
        </section>

        <Divider className="bg-black/10" />

        {/* Collecting and Using Data */}
        <section>
          <EditableText
            section="dataCollection"
            field="title"
            value={privacy.dataCollection?.title || ""}
            as="h2"
            className="text-2xl font-bold mb-4"
          />

          <div className="space-y-6">
            <Card shadow="none" className="border-1 border-black rounded-none">
              <CardBody>
                <EditableText
                  section="dataCollection"
                  field="typesTitle"
                  value={privacy.dataCollection?.typesTitle || ""}
                  as="h3"
                  className="text-lg font-bold mb-2 uppercase tracking-wider"
                />
                <h4 className="font-semibold underline mb-2">Personal Data</h4>
                <EditableText
                  section="dataCollection"
                  field="personalDataText"
                  value={privacy.dataCollection?.personalDataText || ""}
                  as="p"
                  className="mb-4"
                  multiline
                />

                {/* Editable Personal Data Items List (array of strings) */}
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(privacy.dataCollection?.personalDataItems || []).map(
                    (item: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 group">
                        <EditableText
                          section="dataCollection"
                          field={`personalDataItems.${i}`}
                          value={item}
                          className="flex-1"
                        />
                        {isEditMode && (
                          <button
                            onClick={() => deletePersonalDataItem(i)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </li>
                    ),
                  )}
                </ul>

                {isEditMode && (
                  <Button
                    onClick={addPersonalDataItem}
                    size="sm"
                    className="mt-6 bg-[#f8cf2c] text-white"
                    startContent={<Plus className="w-4 h-4" />}
                  >
                    Add New Item
                  </Button>
                )}
              </CardBody>
            </Card>

            <div>
              <h4 className="font-semibold underline mb-2">Usage Data</h4>
              <EditableText
                section="dataCollection"
                field="usageDataText"
                value={privacy.dataCollection?.usageDataText || ""}
                as="p"
                multiline
              />
            </div>

            <div>
              <EditableText
                section="dataCollection"
                field="trackingTitle"
                value={privacy.dataCollection?.trackingTitle || ""}
                className="font-semibold underline mb-2"
              />
              <EditableText
                section="dataCollection"
                field="trackingText"
                value={privacy.dataCollection?.trackingText || ""}
                as="p"
                className="mb-4"
                multiline
              />
              <ul className="space-y-4">
                <li>
                  <strong>Cookies or Browser Cookies:</strong>{" "}
                  <EditableText
                    section="dataCollection"
                    field="cookiesText"
                    value={privacy.dataCollection?.cookiesText || ""}
                    as="span"
                    multiline
                  />
                </li>
                <li>
                  <strong>Web Beacons:</strong>{" "}
                  <EditableText
                    section="dataCollection"
                    field="beaconsText"
                    value={privacy.dataCollection?.beaconsText || ""}
                    as="span"
                    multiline
                  />
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <footer className="mt-20 pt-8 border-t border-black text-center text-xs uppercase tracking-widest">
        End of Privacy Policy
      </footer>
    </main>
  );
};

export default PrivacyPolicy;
