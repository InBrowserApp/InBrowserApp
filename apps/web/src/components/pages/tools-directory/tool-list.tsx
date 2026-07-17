import { ToolIcon } from "@workspace/ui/components/tool/tool-icon"
import { LayoutGrid, Search } from "@workspace/ui/icons"
import { localizePath } from "@/lib/site"
import { getCategoryLabel, resolveEntryLocale } from "@/lib/tool-directory"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"

type ToolListProps = Readonly<{
  entries: readonly ToolSearchIndexEntry[]
  language: SiteLanguage
  categoryLabels: Readonly<Record<string, string>>
}>

type DirectoryEmptyStateProps = Readonly<{
  icon: "registry" | "search"
  title: string
  description: string
}>

function ToolList({ categoryLabels, entries, language }: ToolListProps) {
  return (
    <div className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border">
      {entries.map((entry) => {
        const locale = resolveEntryLocale(entry, language)

        return (
          <a
            key={entry.slug}
            href={localizePath(`/tools/${entry.slug}`, language)}
            className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-muted/50 sm:px-4.5"
          >
            <ToolIcon
              icon={entry.icon}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-3.5">
              <span className="truncate text-[15px] font-medium tracking-[-0.02em] md:w-56 md:shrink-0">
                {locale.name}
              </span>
              <span className="truncate text-[13px] text-muted-foreground md:min-w-0 md:flex-1">
                {locale.description}
              </span>
            </span>
            <span className="hidden shrink-0 text-[10px] font-medium tracking-[0.12em] text-muted-foreground/80 uppercase md:inline">
              {getCategoryLabel(categoryLabels, entry.category)}
            </span>
          </a>
        )
      })}
    </div>
  )
}

function DirectoryEmptyState({
  description,
  icon,
  title,
}: DirectoryEmptyStateProps) {
  const Icon = icon === "registry" ? LayoutGrid : Search

  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center">
      <Icon className="mx-auto size-6 text-muted-foreground" />
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export { DirectoryEmptyState, ToolList }
