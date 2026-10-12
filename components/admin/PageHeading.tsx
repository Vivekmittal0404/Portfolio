export default function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
