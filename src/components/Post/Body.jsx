import React from "react";
import Container from "../container";
import SectionHeader from "../Common/SectionHeader";
import { Button, Link } from "@heroui/react";

export default function Body({ props, link }) {
  return (
    <>
      <Container className="!pt-0">
        <div className="mx-auto max-w-screen-md ">
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: props?.title || "",
                subtitle: props?.subtitle || "",
                description: "",
              }}
            />
          </div>
        </div>
      </Container>

      {/* Image container with fallback */}
      {props?.imageUrl ? (
        <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
          <img
            src={props.imageUrl}
            alt="Blog thumbnail"
            className="object-cover w-full h-full"
            onError={(e) => {
              // Optional: hide broken image or show fallback
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : (
        // Optional fallback if no image
        <div className="relative z-0 mx-auto aspect-video max-w-screen-lg bg-gray-200 flex items-center justify-center lg:rounded-lg">
          <p className="text-gray-500 text-lg">No image available</p>
        </div>
      )}

      <Container>
        <article className="mx-auto max-w-screen-md ">
          <div className="prose mx-auto my-3 dark:prose-invert prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: props?.about }} />
          </div>
          <div className="flex justify-center my-10">
            <Button
              size="md"
              className="bg-[#f8cf2c] text-black font-bold w-full max-w-md"
            >
              <Link className="text-black" href="/blogs">
                View All Blogs
              </Link>
            </Button>
          </div>
        </article>
      </Container>
    </>
  );
}
