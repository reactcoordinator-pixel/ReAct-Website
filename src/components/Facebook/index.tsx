// components/FacebookPost.tsx
"use client";
import SectionHeader from "@/components/Common/SectionHeader";
import React from "react";
import { FacebookEmbed, InstagramEmbed } from "react-social-media-embed";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText, EditableLink } from "@/components/CMS/EditableField";
import { Spinner } from "@heroui/react";

export default function FacebookPost() {
  const { content, isLoading, isReady, isEditMode } = useCMS();

  if (isLoading || !isReady) {
    return (
      <div className="mb-0 mt-20 w-full h-48 flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const socialContent = content.socialPosts;

  return (
    <>
      <div className="bg-[#ededed]">
        {/* Facebook Section */}
        {isEditMode ? (
          <div className="mx-auto relative text-center pt-10">
            <EditableText
              section="socialPosts"
              field="facebookSubtitle"
              value={socialContent.facebookSubtitle}
              as="h3"
              className="mb-4 text-3xl font-bold"
            />
            <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 h-2 bg-[#f8cf2c]  w-40"></div>
            <EditableText
              section="socialPosts"
              field="facebookDescription"
              value={socialContent.facebookDescription}
              as="p"
              className="mx-auto max-w-3xl text-gray-600"
              multiline
            />
          </div>
        ) : (
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: socialContent.facebookTitle,
                subtitle: socialContent.facebookSubtitle,
                description: socialContent.facebookDescription,
              }}
            />
          </div>
        )}

        <div
          className="my-10"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {socialContent.facebookPosts.map((url: string, index: number) => (
            <EditableLink
              key={index}
              section="socialPosts"
              field="facebookPosts"
              index={index}
              value={url}
              renderContent={(url) => (
                <iframe
                  src={url}
                  width="400"
                  height="560"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-2xl"
                />
              )}
            />
          ))}
        </div>

        {/* Instagram Section */}
        <div className="mt-10 mb-12 mx-10">
          {isEditMode ? (
            <div className="mx-auto text-center relative">
              <EditableText
                section="socialPosts"
                field="instagramSubtitle"
                value={socialContent.instagramSubtitle}
                as="h3"
                className="mb-4 text-3xl font-bold"
              />
              <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 h-2 bg-[#f8cf2c]  w-40"></div>
              <EditableText
                section="socialPosts"
                field="instagramDescription"
                value={socialContent.instagramDescription}
                as="p"
                className="mx-auto max-w-3xl text-gray-600"
                multiline
              />
            </div>
          ) : (
            <div className="text-center">
              <SectionHeader
                headerInfo={{
                  title: socialContent.instagramTitle,
                  subtitle: socialContent.instagramSubtitle,
                  description: socialContent.instagramDescription,
                }}
              />
            </div>
          )}

          <div
            className="my-10"
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {socialContent.instagramPosts.map((url: string, index: number) => (
              <EditableLink
                key={index}
                section="socialPosts"
                field="instagramPosts"
                index={index}
                value={url}
                renderContent={(url) => (
                  <InstagramEmbed width={350} url={url} />
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
