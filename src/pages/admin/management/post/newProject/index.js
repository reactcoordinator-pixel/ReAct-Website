"use client";

import ServicesForm from "@/components/Management/ServicesForm";
import { postDoc } from "../../../../api/functions/post";
import { Container } from "@mantine/core";
import SectionHeader from "@/components/Common/SectionHeader";
// import Header from "components/Header";
import RootLayout from "@/components/RootLayout";

export default function Page() {
  const handleSave = async (id, data) => {
    try {
      const res = await postDoc(data, "service");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <RootLayout>
        {/* <Header admin={true} /> */}
        <Container size={"lg"}>
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: "Post Form",
                subtitle: "Write A New Project",
                description: "",
              }}
            />
          </div>
          <ServicesForm handleSave={handleSave} />
        </Container>
      </RootLayout>
    </>
  );
}
