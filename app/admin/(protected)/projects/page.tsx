import PageHeading from "@/components/admin/PageHeading";
import ProjectManager from "@/components/admin/ProjectManager";
import { getProjectRows } from "@/lib/admin-data";

export const metadata = {
  title: "Projects | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function ProjectsAdminPage() {
  const projects = await getProjectRows();
  return (
    <>
      <PageHeading
        eyebrow="Content"
        title="Projects"
        description="Manage the items shown in the public Projects section."
      />
      <ProjectManager initialProjects={projects} />
    </>
  );
}
