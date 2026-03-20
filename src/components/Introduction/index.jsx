// components/Introduction.tsx - Fixed with no hardcoded defaults
"use client";
import { motion } from "framer-motion";
import SectionHeader from "../Common/SectionHeader";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText, EditableImage } from "@/components/CMS/EditableField";
import { Spinner } from "@heroui/react";

export default function Introduction() {
  const { content, isEditMode, isLoading, isReady } = useCMS();

  // Show loading while data fetches
  if (isLoading || !isReady) {
    return (
      <section className="py-10 min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </section>
    );
  }

  // Safe to access now
  const introContent = content.introduction;

  return (
    <section id="features" className="py-10">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {isEditMode ? (
          <div className="mx-auto text-center relative">
            <EditableText
              section="introduction"
              field="subtitle"
              value={introContent.subtitle}
              as="h3"
              className="mb-4 text-3xl font-bold"
            />
            <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 h-2 bg-[#f8cf2c] w-40"></div>
            <EditableText
              section="introduction"
              field="description"
              value={introContent.description}
              as="p"
              className="mx-auto max-w-3xl text-gray-600"
              multiline
            />
          </div>
        ) : (
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: introContent.title,
                subtitle: introContent.subtitle,
                description: introContent.description,
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
          className="animate_top mx-auto"
        >
          <div className="space-y-6 mt-10 mx-10 md:space-y-0 animate_top md:flex md:gap-6 lg:items-center lg:gap-12">
            <div className="md:5/12 lg:w-5/12">
              <EditableImage
                section="introduction"
                field="image"
                value={introContent.image}
                alt="ReAct Team"
                className="w-full h-auto rounded-tl-[200px] rounded-br-[200px]"
                style={{ borderRadius: "200px 0px 200px 0px" }}
                maxWidth={800}
                maxHeight={600}
                aspectRatio="4:3"
              />
            </div>
            <div className="md:7/12 lg:w-6/12">
              <EditableText
                section="introduction"
                field="heading"
                value={introContent.heading}
                as="h2"
                className="text-2xl text-[#f8cf2c] font-bold md:text-4xl"
              />

              <EditableText
                section="introduction"
                field="paragraph1"
                value={introContent.paragraph1}
                as="p"
                className="mt-6 text-gray-600"
                multiline
              />

              <EditableText
                section="introduction"
                field="paragraph2"
                value={introContent.paragraph2}
                as="p"
                className="mt-6 text-gray-600"
                multiline
              />

              <a className="text-blue-500 hover:underline" href="/AboutUs">
                Read More.
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
