export default function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail?: string;
}) {
  return (
    <section className="border border-white/10 bg-white/[0.02] p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="mt-2 text-xs text-gray-500">{detail}</p>}
    </section>
  );
}
