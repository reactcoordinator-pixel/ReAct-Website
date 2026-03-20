"use client";

import { useState, useEffect } from "react";
import SingleFeature from "./SingleFeature";
import SectionHeader from "@/components/Common/SectionHeader";
import { getService } from "../../pages/api/functions/get";
import { Spinner } from "@heroui/react";

const Services = () => {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getService();
        setService(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <section id="features" className="py-20 lg:py-25 bg-[#ededed] xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <div className="text-center">
          <SectionHeader
            headerInfo={{
              title: "",
              subtitle: "Projects of ReAct",
              description: "Explore projects of ReAct",
            }}
          />
        </div>

        <div className="mt-12.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:mt-20">
          {service.map((feature: any, key: number) => (
            <SingleFeature feature={feature} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
