import Link from "next/link";
import type { ImpactStat } from "@/types";

export function StatCard({
  value,
  label,
  programme,
  location,
  period,
  methodology,
  href,
}: ImpactStat) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-white p-6 shadow-sm">
      <p className="text-3xl font-bold text-primary sm:text-4xl">{value}</p>
      <h3 className="mt-2 text-base font-semibold text-foreground">{label}</h3>
      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-foreground">Programme</dt>
          <dd className="text-muted-foreground">{programme}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Place and period</dt>
          <dd className="text-muted-foreground">
            {location} · {period}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">How it was counted</dt>
          <dd className="text-muted-foreground">{methodology}</dd>
        </div>
      </dl>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center self-start text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        View project evidence
      </Link>
    </article>
  );
}
