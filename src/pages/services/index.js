import Services from "@/components/Services";
import RootLayout from "@/components/RootLayout";

export default function page({ projects }) {
  return (
    <RootLayout>
      <div>
        <Services all={true} initialData={projects} />
      </div>
    </RootLayout>
  );
}

// Fetch on the server so the project images ship inside the initial HTML and
// start downloading immediately, instead of after a client-side round-trip.
export async function getServerSideProps() {
  const { getProjects } = await import("@/lib/data");
  const projects = await getProjects();
  return { props: { projects } };
}
