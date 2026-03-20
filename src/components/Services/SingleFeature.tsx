"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";

const SingleFeature = ({ feature }: { feature: any }) => {
  const router = useRouter();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <Card
        className="w-full max-w-96 mx-auto cursor-pointer"
        shadow="lg"
        isPressable
        onPress={() => router.push(`/services/${feature.id}`)}
      >
        <CardBody className="overflow-visible p-0">
          <img
            src={feature.imageUrl || "/placeholder.jpg"}
            alt={feature.subtitle}
            className="w-full object-cover h-72 rounded-t-lg transition-transform hover:scale-105"
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")} // fallback
          />
        </CardBody>
        <CardFooter className="text-center">
          <b className="transition-colors duration-300 hover:text-[#f8cf2c]">
            {feature.subtitle}
          </b>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SingleFeature;
