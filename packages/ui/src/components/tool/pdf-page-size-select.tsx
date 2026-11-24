import { ChevronDown } from "@workspace/ui/icons"

export type PdfPageSizeLabels = {
  pageSize: string
  original: string
  a4: string
  letter: string
}

type Size = Exclude<keyof PdfPageSizeLabels, "pageSize">

export function PdfPageSizeSelect({
  labels,
  value,
  onChange,
}: {
  labels: PdfPageSizeLabels
  value: Size
  onChange: (size: Size) => void
}) {
  return (
    <label className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-medium">
      {labels.pageSize}
      <span className="relative max-w-full min-w-0">
        <select
          className="h-9 max-w-full appearance-none rounded-lg border border-input bg-background ps-3 pe-8 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value as Size)}
        >
          <option value="original">{labels.original}</option>
          <option value="a4">{labels.a4}</option>
          <option value="letter">{labels.letter}</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute inset-e-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
    </label>
  )
}
