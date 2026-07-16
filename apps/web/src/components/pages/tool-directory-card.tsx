import { ToolIcon } from "@workspace/ui/components/tool/tool-icon"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"

import type { ToolDirectoryEntry } from "@/lib/tools-directory"

type ToolDirectoryCardProps = Readonly<{
  entry: ToolDirectoryEntry
  href: string
}>

function ToolDirectoryCard({ entry, href }: ToolDirectoryCardProps) {
  return (
    <a
      data-tool-card={entry.slug}
      href={href}
      className="group block h-full rounded-[calc(var(--radius)*1.8)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ToolSurface className="flex h-full flex-col gap-3 transition-[border-color,box-shadow] group-hover:border-foreground/20 group-focus-visible:border-foreground/30 motion-reduce:transition-none">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 className="flex min-w-0 items-center gap-2 font-heading text-lg leading-tight tracking-[var(--tracking-display)]">
            <ToolIcon
              aria-hidden="true"
              icon={entry.icon}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="min-w-0 truncate">{entry.name}</span>
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-pretty text-muted-foreground">
            {entry.description}
          </p>
        </div>
      </ToolSurface>
    </a>
  )
}

export { ToolDirectoryCard }
