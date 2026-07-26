interface StatCardProps {
  value: string;
  label: string;
  note?: string;
}

export function StatCard({ value, label, note }: StatCardProps) {
  const isPlaceholder = value.includes("[") || value.includes("]") || label.includes("[");

  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <p className="text-3xl font-bold text-primary sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      {note && (
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      )}
      {isPlaceholder && (
        <span className="mt-2 inline-block rounded-full bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning-fg">
          Placeholder
        </span>
      )}
    </div>
  );
}
