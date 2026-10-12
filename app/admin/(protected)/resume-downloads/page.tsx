import MetricCard from "@/components/admin/MetricCard";
import PageHeading from "@/components/admin/PageHeading";
import { getResumeDownloadData } from "@/lib/admin-data";

export const metadata = {
  title: "Resume downloads | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function ResumeDownloadsPage() {
  const { totals, rows } = await getResumeDownloadData();

  return (
    <>
      <PageHeading
        eyebrow="Resume"
        title="Resume downloads"
        description="Download events are anonymous and are not linked to contact messages."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total downloads" value={totals.total} />
        <MetricCard label="Today" value={totals.today} />
        <MetricCard label="This week" value={totals.week} />
        <MetricCard label="This month" value={totals.month} />
      </div>
      <div className="mt-8 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Downloaded</th>
              <th className="px-4 py-3 font-medium">Approx. location</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Source / referrer</th>
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Anonymous ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-white/10" key={row.id}>
                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                  {new Date(row.downloadedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {[row.city, row.region, row.country]
                    .filter(Boolean)
                    .join(", ") || "Unknown"}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {row.device}
                  <span className="block text-xs text-gray-600">
                    {row.browser} · {row.operatingSystem}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {row.source}
                  {row.referringDomain && (
                    <span className="block text-xs text-gray-600">
                      {row.referringDomain}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {[row.utmSource, row.utmMedium, row.utmCampaign]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs text-gray-600"
                  title={row.anonymousId}
                >
                  {row.anonymousId.slice(0, 8)}…
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-gray-500" colSpan={6}>
                  No resume downloads recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
