import { Container } from "@mantine/core";
import SectionHeader from "@/components/Common/SectionHeader";
// import ServicesTable from "components/Management/ServicesForm/EditService/Index";
// import { ServicesTable } from "../../../components/Management/ServicesForm/EditService/index";
// import Header from "components/Header";

// import { ServicesTable } from "../../../components/Management/ServicesForm/EditService";
import { ServicesTable } from "../../../../components/Management/ServicesForm/EditService";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <>
      <RootLayout>
        {/* <Header admin={true} /> */}
        <Container size={"lg"}>
          <br />
          <div className="text-center">
            <SectionHeader
              headerInfo={{
                title: "Blog Management",
                subtitle: "Manage your Projects efficiently",
                description:
                  "Here you can manage all your posts, including editing and deleting.",
              }}
            />
          </div>
          <br />
          <ServicesTable />
        </Container>
      </RootLayout>
    </>
  );
}
