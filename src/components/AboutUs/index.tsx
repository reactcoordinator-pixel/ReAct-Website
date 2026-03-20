// components/AboutUs.tsx
"use client";
import React from "react";
import { Image } from "@chakra-ui/react";
import SectionHeader from "@/components/Common/SectionHeader";
import { motion } from "framer-motion";
import Cards from "@/components/Cards";
import RootLayout from "@/components/RootLayout";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText, EditableImage } from "@/components/CMS/EditableField";
import { EditableObjectives } from "@/components/CMS/EditableField";

export default function AboutUs() {
  const { content, isEditMode } = useCMS();
  const aboutContent = content?.aboutUs || {
    headerImage: "/test.jpg",
    title: "",
    subtitle: "",
    introText: "",
    mainImage: "/about.jpg",
    objectivesTitle: "",
    objectives: [""],
    historyTitle: "",
    historyText: "   ",
    conclusionText: " ",
  };

  return (
    <RootLayout>
      <section className="backdrop-blur-sm">
        <div className="relative">
          <EditableImage
            section="aboutUs"
            field="headerImage"
            value={aboutContent.headerImage}
            alt="About Us Header"
            className="w-screen h-[300px] object-cover mb-3"
            maxWidth={1920}
            maxHeight={600}
            aspectRatio="21:9"
            helpText="This appears at the top of the page as a banner"
          />
        </div>

        {isEditMode ? (
          <div className="mx-auto text-center mb-8 px-4">
            <EditableText
              section="aboutUs"
              field="subtitle"
              value={aboutContent.subtitle}
              as="h3"
              className="mb-4 text-3xl font-bold"
            />
          </div>
        ) : (
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: aboutContent.title,
                subtitle: aboutContent.subtitle,
                description: "",
              }}
            />
          </div>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="pb-16">
            <div className="mx-10">
              <div className="mb-10">
                <EditableText
                  section="aboutUs"
                  field="introText"
                  value={aboutContent.introText}
                  as="p"
                  className="mt-0 text-base md:text-xl md:mx-10 mx-0 mb-10 text-center text-gray-600"
                  multiline
                />
              </div>

              <div className="w-full mb-10">
                <EditableImage
                  section="aboutUs"
                  field="mainImage"
                  value={aboutContent.mainImage}
                  alt="ReAct Team"
                  className="w-full h-auto"
                />
              </div>

              <Cards />

              {/* Objectives Section */}
              <section className="py-10 md:mx-10">
                <div className="px-12 md:px-8">
                  <div className="animate_top mx-auto text-center">
                    {isEditMode ? (
                      <div className="mb-8">
                        <EditableText
                          section="aboutUs"
                          field="objectivesTitle"
                          value={aboutContent.objectivesTitle}
                          as="h2"
                          className="text-3xl font-bold text-[#f8cf2c] md:text-4xl"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <SectionHeader
                          headerInfo={{
                            title: "",
                            subtitle: aboutContent.objectivesTitle,
                            description: "",
                          }}
                        />
                      </div>
                    )}

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-[#272727] p-0 py-10 px-8 md:p-10 text-[#f8cf2c] font-bold rounded-xl border">
                        <EditableObjectives
                          section="aboutUs"
                          field="objectives"
                          objectives={aboutContent.objectives}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* History Section */}
              <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
                <div className="mt-10">
                  <EditableText
                    section="aboutUs"
                    field="historyTitle"
                    value={aboutContent.historyTitle}
                    as="h1"
                    className="text-2xl md:text-3xl ml-0 md:ml-4 text-black font-bold"
                  />
                  <EditableText
                    section="aboutUs"
                    field="historyText"
                    value={aboutContent.historyText}
                    as="p"
                    className="mt-4 md:ml-4 ml-0 text-gray-600"
                    multiline
                  />
                </div>
              </div>

              {/* Conclusion */}
              <div className="py-3 mt-10 mx-0 md:mx-10 border rounded-2xl bg-[#f8cf2c]">
                <EditableText
                  section="aboutUs"
                  field="conclusionText"
                  value={aboutContent.conclusionText}
                  as="p"
                  className="mx-2 md:mx-7"
                  multiline
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </RootLayout>
  );
}
