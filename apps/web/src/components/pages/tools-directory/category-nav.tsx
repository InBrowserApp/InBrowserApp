import { cn } from "@workspace/ui/lib/utils"
import { getCategoryLabel } from "@/lib/tool-directory"

import type { ToolCategoryCount } from "@/lib/tool-directory"

type CategoryNavProps = Readonly<{
  counts: readonly ToolCategoryCount[]
  totalCount: number
  selected: string | null
  onSelect: (category: string | null) => void
  labels: Readonly<Record<string, string>>
  allLabel: string
  categoriesLabel: string
  formatCount: (count: number) => string
}>

type CategoryOption = Readonly<{
  category: string | null
  label: string
  count: number
}>

function createCategoryOptions({
  counts,
  totalCount,
  labels,
  allLabel,
}: Pick<
  CategoryNavProps,
  "counts" | "totalCount" | "labels" | "allLabel"
>): readonly CategoryOption[] {
  return [
    { category: null, count: totalCount, label: allLabel },
    ...counts.map(({ category, count }) => ({
      category,
      count,
      label: getCategoryLabel(labels, category),
    })),
  ]
}

function CategorySidebar(props: CategoryNavProps) {
  const { categoriesLabel, formatCount, onSelect, selected } = props

  return (
    <nav
      aria-label={categoriesLabel}
      className="hidden lg:sticky lg:top-8 lg:block"
    >
      <p className="mb-2 px-2.5 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
        {categoriesLabel}
      </p>
      <ul className="flex list-none flex-col gap-0.5 ps-0">
        {createCategoryOptions(props).map(({ category, count, label }) => {
          const isActive = selected === category

          return (
            <li key={category ?? "all"}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  onSelect(category)
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="truncate">{label}</span>
                <span
                  className={cn(
                    "shrink-0 text-sm font-normal",
                    isActive
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70"
                  )}
                >
                  {formatCount(count)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function CategoryChips(props: CategoryNavProps) {
  const { categoriesLabel, formatCount, onSelect, selected } = props

  return (
    <div
      aria-label={categoriesLabel}
      role="group"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden"
    >
      {createCategoryOptions(props).map(({ category, count, label }) => {
        const isActive = selected === category

        return (
          <button
            key={category ?? "all"}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              onSelect(category)
            }}
            className={cn(
              "inline-flex h-7.5 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] whitespace-nowrap transition-colors",
              isActive
                ? "border-transparent bg-primary font-medium text-primary-foreground"
                : "border-border text-foreground hover:bg-muted/60"
            )}
          >
            {label}
            <span
              className={cn(isActive ? "opacity-60" : "text-muted-foreground")}
            >
              {formatCount(count)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { CategoryChips, CategorySidebar }
