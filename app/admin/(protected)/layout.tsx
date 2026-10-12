import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
