import BlogsListing from "@/components/BlogsListing";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <RootLayout>
      <div>
        <BlogsListing all={true} category={"BLOG"} />
      </div>
    </RootLayout>
  );
}
