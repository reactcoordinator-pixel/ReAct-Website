"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { Image } from "@mantine/core";
import SectionHeader from "@/components/Common/SectionHeader";
import { getDocById } from "../../../pages/api/functions/get";
import { Button, Link } from "@heroui/react";

function Service() {
  const router = useRouter(); // Use useRouter hook
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const match = router.asPath.match(/\/([^/]+)$/); // Use router.asPath
        const id = match && match[1];

        if (id) {
          let data = await getDocById(id, "service");
          setService(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching service:", error);
        setLoading(false);
      }
    };

    fetchService();
  }, [router.asPath]); // Listen to changes in router.asPath

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : service ? (
        <>
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: service?.title,
                subtitle: service?.subtitle,
                description: service?.description,
              }}
            />
          </div>
          <Image
            src={service?.imageUrl}
            alt={"Room"}
            my={16}
            loading="eager"
            radius={"lg"}
            style={{
              width: "auto",
              height: "70vh",
              margin: "auto",
              objectFit: "cover",
            }}
          />
          <article className="mx-auto max-w-screen-md">
            <div className="prose mx-auto my-3 text-xl prose-a:text-blue-600">
              <div dangerouslySetInnerHTML={{ __html: service?.about }} />
            </div>
            <div className="flex justify-center my-10">
              <Button size="md" className="bg-[#f8cf2c] text-white">
                <Link className="text-white" href="/services">
                  View All Projects
                </Link>
              </Button>
            </div>
          </article>
        </>
      ) : (
        <p>Projects not found</p>
      )}
    </div>
  );
}

export default Service;
