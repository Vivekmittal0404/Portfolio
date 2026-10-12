import { redirect } from "next/navigation";
import PageHeading from "@/components/admin/PageHeading";
import ProfileSettings from "@/components/admin/ProfileSettings";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin profile | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <>
      <PageHeading
        eyebrow="Account"
        title="Admin profile"
        description="Manage the portfolio owner account."
      />
      <ProfileSettings
        initialName={admin.displayName}
        email={admin.email}
        lastLoginAt={admin.lastLoginAt}
      />
    </>
  );
}
