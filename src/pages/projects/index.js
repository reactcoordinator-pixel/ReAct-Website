import BlogsListing from "@/components/BlogsListing";
import Feature from "@/components/Features";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <RootLayout>
      <div>
        <Feature />
        <BlogsListing all={true} category={"PROJECTS"} />
      </div>
    </RootLayout>
  );
}
