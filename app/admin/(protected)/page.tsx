import Link from "next/link";
import BreakdownList from "@/components/admin/BreakdownList";
import MetricCard from "@/components/admin/MetricCard";
import PageHeading from "@/components/admin/PageHeading";
import { getAnalyticsData, getOverviewData } from "@/lib/admin-data";

export const metadata = {
  title: "Overview | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const [overview, analytics] = await Promise.all([
    getOverviewData(),
    getAnalyticsData(),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Overview"
        title="Portfolio activity"
        description="A private summary of traffic, resume interest, and contact messages."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Visitors today"
          value={overview.visitors.today}
          detail={`${overview.visitors.yesterday} yesterday`}
        />
        <MetricCard
          label="Visitors this week"
          value={overview.visitors.week}
          detail={`${overview.visitors.total} total visitors`}
        />
        <MetricCard
          label="Visitors this month"
          value={overview.visitors.month}
        />
        <MetricCard
          label="Resume downloads"
          value={overview.downloads.total}
          detail={`${overview.downloads.today} today · ${overview.downloads.week} this week`}
        />
        <MetricCard
          label="Downloads this month"
          value={overview.downloads.month}
        />
        <MetricCard
          label="Unread messages"
          value={overview.messages.unread}
          detail={`${overview.messages.total} total messages`}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <BreakdownList title="Traffic sources" rows={analytics.sources} />
        <BreakdownList title="Top countries" rows={analytics.countries} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent messages</h2>
            <Link
              className="text-xs text-blue-300 hover:text-white"
              href="/admin/messages"
            >
              All messages
            </Link>
          </div>
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentMessages.map((message) => (
                  <tr className="border-t border-white/10" key={message.id}>
                    <td className="px-4 py-3 text-gray-200">
                      {message.name}
                      {!message.isRead && (
                        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                      )}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-400">
                      {message.subject}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {new Date(message.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {overview.recentMessages.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-500" colSpan={3}>
                      No messages received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent resume downloads</h2>
            <Link
              className="text-xs text-blue-300 hover:text-white"
              href="/admin/resume-downloads"
            >
              All downloads
            </Link>
          </div>
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentDownloads.map((download) => (
                  <tr className="border-t border-white/10" key={download.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                      {new Date(download.downloadedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {download.source}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {download.country ?? "Unknown"}
                    </td>
                  </tr>
                ))}
                {overview.recentDownloads.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-500" colSpan={3}>
                      No downloads recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
