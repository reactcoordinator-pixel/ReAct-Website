import BlogsListing from "@/components/BlogsListing";
import RootLayout from "@/components/RootLayout";

export default function page({ blogs }) {
  return (
    <RootLayout>
      <div>
        <BlogsListing all={true} category={"BLOG"} initialBlogs={blogs} />
      </div>
    </RootLayout>
  );
}

// Fetch on the server so the blog images ship inside the initial HTML and
// start downloading immediately, instead of after a client-side round-trip.
export async function getServerSideProps() {
  const { getBlogs } = await import("@/lib/data");
  const blogs = await getBlogs();
  return { props: { blogs } };
}
