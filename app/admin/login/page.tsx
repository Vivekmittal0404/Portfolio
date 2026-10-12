import { redirect } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin Login | Vivek Mittal",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <section className="w-full max-w-md border border-white/10 bg-white/[0.02] p-8 sm:p-10">
        <Link
          className="text-sm text-gray-400 transition-colors hover:text-white"
          href="/"
        >
          ← Portfolio
        </Link>
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
          Secure access
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Sign in with the portfolio owner account.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
