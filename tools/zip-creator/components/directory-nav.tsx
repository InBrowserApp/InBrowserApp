import { Button } from "@workspace/ui/components/ui/button"
import { ArrowUp, ChevronRight } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { Messages } from "../types"
import type { ZipDrag } from "../use-zip-drag"

export function DirectoryNav({
  directory,
  disabled,
  messages: m,
  onNavigate,
  drag,
}: {
  directory: string
  disabled: boolean
  messages: Messages
  onNavigate: (path: string) => void
  drag?: ZipDrag
}) {
  const segments = directory ? directory.split("/") : []
  const root = drag?.dropTarget("", "nav:root")
  const parent = segments.slice(0, -1).join("/")
  const up = drag?.dropTarget(parent, "nav:up")
  const highlight = "ring-2 ring-primary ring-inset"

  return (
    <nav
      aria-label={m.contentsTitle}
      className="flex min-w-0 items-start gap-2 text-sm"
    >
      <Button
        {...up?.props}
        type="button"
        variant="outline"
        size="icon"
        className={cn("size-11", up?.isOver && highlight)}
        disabled={disabled || !directory}
        onClick={() => onNavigate(parent)}
        aria-label={m.goUp}
        title={m.goUp}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        <li className="max-w-full min-w-0">
          {directory ? (
            <Button
              {...root?.props}
              type="button"
              variant="ghost"
              className={cn("h-11 max-w-full", root?.isOver && highlight)}
              disabled={disabled}
              onClick={() => onNavigate("")}
            >
              {m.root}
            </Button>
          ) : (
            <span
              {...root?.props}
              className={cn(
                "flex min-h-11 items-center rounded-lg px-2.5",
                root?.isOver && highlight
              )}
              aria-current="page"
            >
              {m.root}
            </span>
          )}
        </li>
        {segments.map((segment, index) => {
          const path = segments.slice(0, index + 1).join("/")
          const drop = drag?.dropTarget(path, `nav:${path}`)
          return (
            <li
              key={path}
              className="flex max-w-full min-w-0 items-center gap-1"
            >
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
              />
              {index === segments.length - 1 ? (
                <span
                  {...drop?.props}
                  className={cn(
                    "flex h-11 min-w-0 items-center rounded-lg px-2.5",
                    drop?.isOver && highlight
                  )}
                  aria-current="page"
                  title={path}
                >
                  <bdi className="truncate">{segment}</bdi>
                </span>
              ) : (
                <Button
                  {...drop?.props}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-11 min-w-0 shrink",
                    drop?.isOver && highlight
                  )}
                  disabled={disabled}
                  onClick={() => onNavigate(path)}
                  title={path}
                >
                  <bdi className="truncate">{segment}</bdi>
                </Button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
