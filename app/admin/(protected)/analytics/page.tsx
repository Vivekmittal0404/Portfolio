import BreakdownList from "@/components/admin/BreakdownList";
import PageHeading from "@/components/admin/PageHeading";
import { getAnalyticsData } from "@/lib/admin-data";

export const metadata = {
  title: "Analytics | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <>
      <PageHeading
        eyebrow="Analytics"
        title="Traffic breakdown"
        description="Aggregated counts from anonymous page-view events."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownList title="Traffic sources" rows={analytics.sources} />
        <BreakdownList title="Countries" rows={analytics.countries} />
        <BreakdownList title="Cities" rows={analytics.cities} />
        <BreakdownList title="Popular pages" rows={analytics.pages} />
        <BreakdownList title="Devices" rows={analytics.devices} />
        <BreakdownList title="Browsers" rows={analytics.browsers} />
      </div>
    </>
  );
}
