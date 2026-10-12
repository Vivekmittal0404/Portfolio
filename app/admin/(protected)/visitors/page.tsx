import PageHeading from "@/components/admin/PageHeading";
import { getVisitorRows } from "@/lib/admin-data";

export const metadata = {
  title: "Visitors | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function VisitorsPage() {
  const visitors = await getVisitorRows();

  return (
    <>
      <PageHeading
        eyebrow="Visitors"
        title="Visitor sessions"
        description="Anonymous browser sessions only. IP addresses and visitor names are not stored."
      />
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">First seen</th>
              <th className="px-4 py-3 font-medium">Approx. location</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Landing page</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Anonymous ID</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr
                className="border-t border-white/10 align-top"
                key={visitor.id}
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                  {new Date(visitor.firstSeenAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {[visitor.city, visitor.region, visitor.country]
                    .filter(Boolean)
                    .join(", ") || "Unknown"}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {visitor.device}
                  <span className="block text-xs text-gray-600">
                    {visitor.browser} · {visitor.operatingSystem}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {visitor.source}
                  {visitor.referringDomain && (
                    <span className="block text-xs text-gray-600">
                      {visitor.referringDomain}
                    </span>
                  )}
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-gray-400">
                  {visitor.landingPage}
                </td>
                <td className="max-w-[180px] px-4 py-3 text-gray-500">
                  {visitor.pagesVisited.join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-400">
                  {Math.floor(visitor.durationSeconds / 60)}m{" "}
                  {visitor.durationSeconds % 60}s
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs text-gray-600"
                  title={visitor.anonymousId}
                >
                  {visitor.anonymousId.slice(0, 8)}…
                </td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-gray-500" colSpan={8}>
                  No visitor sessions recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
