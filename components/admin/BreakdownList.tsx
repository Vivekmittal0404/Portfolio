export type BreakdownRow = {
  name: string;
  count: number;
  percentage: number;
};

export default function BreakdownList({
  title,
  rows,
}: {
  title: string;
  rows: BreakdownRow[];
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <section className="border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-gray-500">No data collected yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-gray-300">{row.name}</span>
                <span className="shrink-0 tabular-nums text-gray-500">
                  {row.count} · {row.percentage}%
                </span>
              </div>
              <div className="h-1 bg-white/10">
                <div
                  className="h-full bg-blue-400"
                  style={{
                    width: `${Math.min(100, (row.count / max) * 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
