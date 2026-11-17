import type { Row } from "../core/report"

export function InfoRows({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y text-sm">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <dt className="break-words text-muted-foreground">{label}</dt>
          <dd className="min-w-0 break-words">
            <bdi>{value}</bdi>
          </dd>
        </div>
      ))}
    </dl>
  )
}
