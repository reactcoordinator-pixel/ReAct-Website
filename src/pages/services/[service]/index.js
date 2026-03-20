import SectionHeader from "@/components/Common/SectionHeader";
import Service from "./Service";
import { Container, Image } from "@mantine/core";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <RootLayout>
      <Container size={"lg"} className="w-full justify-center">
        <Service />
      </Container>
    </RootLayout>
  );
}
