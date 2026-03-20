import Post from "@/components/Post";
import RootLayout from "@/components/RootLayout";

export default function page() {
  return (
    <RootLayout>
      <div>
        <Post link={"/blogs"} />
      </div>
    </RootLayout>
  );
}
