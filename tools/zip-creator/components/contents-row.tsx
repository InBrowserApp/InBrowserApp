import { Button } from "@workspace/ui/components/ui/button"
import { ChevronRight, File, Folder, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../format"

import type { Messages, ZipItem } from "../types"

const nameLayout =
  "grid h-11 w-full min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 rounded-lg border border-transparent px-2"

export function ContentsRow({
  item,
  disabled,
  messages: m,
  lang,
  onOpen,
  onRemove,
}: {
  item: ZipItem
  disabled: boolean
  messages: Messages
  lang: string
  onOpen: (path: string) => void
  onRemove: (path: string) => void
}) {
  const name = item.path.slice(item.path.lastIndexOf("/") + 1)
  const Icon = item.file ? File : Folder
  const removeLabel = m.remove.replace("{name}", name)
  const content = (
    <>
      <Icon
        aria-hidden="true"
        data-icon="inline-start"
        className="text-muted-foreground"
      />
      <span className="flex min-w-0 items-center gap-2">
        <bdi className="min-w-0 truncate" title={item.path}>
          {name}
        </bdi>
        {!item.file ? (
          <ChevronRight
            aria-hidden="true"
            data-icon="inline-end"
            className="text-muted-foreground rtl:rotate-180"
          />
        ) : null}
      </span>
    </>
  )

  return (
    <li className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_2.75rem] items-center gap-2 rounded-md px-1 py-1 hover:bg-muted/50">
      {item.file ? (
        <div className={cn(nameLayout, "text-sm font-medium [&_svg]:size-4")}>
          {content}
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={() => onOpen(item.path)}
          className={nameLayout}
        >
          {content}
        </Button>
      )}
      <bdi className="text-end text-xs text-muted-foreground tabular-nums">
        {item.file ? formatBytes(item.file.size, lang) : m.folder}
      </bdi>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11"
        disabled={disabled}
        aria-label={removeLabel}
        title={removeLabel}
        onClick={() => onRemove(item.path)}
      >
        <X aria-hidden="true" />
      </Button>
    </li>
  )
}
