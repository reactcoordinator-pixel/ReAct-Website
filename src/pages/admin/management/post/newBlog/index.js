"use client";

import PostForm from "@/components/Management/PostForm";
import { postDoc } from "../../../../api/functions/post";
import { Container } from "@mantine/core";
import SectionHeader from "@/components/Common/SectionHeader";
import RootLayout from "@/components/RootLayout";

// import Header from "components/Header";

export default function Page() {
  const handleSave = async (id, data) => {
    try {
      const res = await postDoc(data, "blogs");
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
            {" "}
            <SectionHeader
              headerInfo={{
                title: "Post Form",
                subtitle: "Write A New Blog",
                description: "",
              }}
            />
          </div>
          <PostForm handleSave={handleSave} />
        </Container>
      </RootLayout>
    </>
  );
}
