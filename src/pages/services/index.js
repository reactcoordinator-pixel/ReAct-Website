import Services from "@/components/Services";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <RootLayout>
      <div>
        <Services all={true} />
      </div>
    </RootLayout>
  );
}
