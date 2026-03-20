// components/MissionAndVision.tsx - Fixed
"use client";
import { motion } from "framer-motion";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText } from "@/components/CMS/EditableField";
import { Spinner } from "@heroui/react";

const MissionAndVision = () => {
  const { content, isLoading, isReady } = useCMS();

  if (isLoading || !isReady) {
    return (
      <div className="mb-0 mt-20 w-full h-48 flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const mvContent = content.missionVision;

  return (
    <div className="mb-0 mt-20 w-[100%]">
      <div className="relative z-1 rounded-2xl bg-[#f8cf2c] py-8 pt-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top mb-12.5 px-4 md:px-0 lg:mb-17.5"
        >
          <div className="flex justify-around mt-10 flex-wrap mx-16">
            <div className="md:w-1/2">
              <EditableText
                section="missionVision"
                field="missionTitle"
                value={mvContent.missionTitle}
                as="h2"
                className="text-3xl font-bold text-[#252827] xl:text-sectiontitle3"
              />
              <EditableText
                section="missionVision"
                field="missionText"
                value={mvContent.missionText}
                as="p"
                className="mx-auto xl:mr-[239px] mt-4"
                multiline
              />
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <EditableText
                section="missionVision"
                field="visionTitle"
                value={mvContent.visionTitle}
                as="h2"
                className="text-3xl font-bold text-[#252827] xl:text-sectiontitle3"
              />
              <EditableText
                section="missionVision"
                field="visionText"
                value={mvContent.visionText}
                as="p"
                className="mx-auto mt-4"
                multiline
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MissionAndVision;
