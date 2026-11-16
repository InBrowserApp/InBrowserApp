import { Button } from "@workspace/ui/components/ui/button"
import { ArrowUp, ChevronRight } from "@workspace/ui/icons"

import type { Messages } from "../types"

export function DirectoryNav({
  directory,
  disabled,
  messages: m,
  onNavigate,
}: {
  directory: string
  disabled: boolean
  messages: Messages
  onNavigate: (path: string) => void
}) {
  const segments = directory ? directory.split("/") : []

  return (
    <nav
      aria-label={m.contentsTitle}
      className="flex min-w-0 items-start gap-2 text-sm"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11"
        disabled={disabled || !directory}
        onClick={() => onNavigate(segments.slice(0, -1).join("/"))}
        aria-label={m.goUp}
        title={m.goUp}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        <li className="max-w-full min-w-0">
          {directory ? (
            <Button
              type="button"
              variant="ghost"
              className="h-11 max-w-full"
              disabled={disabled}
              onClick={() => onNavigate("")}
            >
              {m.root}
            </Button>
          ) : (
            <span
              className="flex min-h-11 items-center px-2.5"
              aria-current="page"
            >
              {m.root}
            </span>
          )}
        </li>
        {segments.map((segment, index) => {
          const path = segments.slice(0, index + 1).join("/")
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
                  className="flex h-11 min-w-0 items-center px-2.5"
                  aria-current="page"
                  title={path}
                >
                  <bdi className="truncate">{segment}</bdi>
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 min-w-0 shrink"
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
