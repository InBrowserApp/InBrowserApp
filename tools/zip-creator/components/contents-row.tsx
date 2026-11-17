import { Button } from "@workspace/ui/components/ui/button"
import { ChevronRight, File, Folder } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../format"
import { EntryMenu } from "./entry-menu"

import type { EntryAction } from "./entry-dialog"
import type { Messages, ZipItem } from "../types"
import type { ZipDrag } from "../use-zip-drag"

const nameLayout =
  "grid h-11 w-full min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 rounded-lg border border-transparent px-2"

export function ContentsRow({
  item,
  disabled,
  messages: m,
  lang,
  onOpen,
  onRemove,
  onEdit,
  drag,
}: {
  item: ZipItem
  disabled: boolean
  messages: Messages
  lang: string
  onOpen: (path: string) => void
  onRemove: (path: string) => void
  onEdit: (action: EntryAction, trigger?: HTMLButtonElement | null) => void
  drag: ZipDrag
}) {
  const name = item.path.slice(item.path.lastIndexOf("/") + 1)
  const Icon = item.file ? File : Folder
  const drop = item.file ? null : drag.dropTarget(item.path, `row:${item.path}`)
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
    <li
      {...drag.dragSource(item.path)}
      {...drop?.props}
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)_auto_2.75rem] items-center gap-2 rounded-md px-1 py-1 hover:bg-muted/50",
        drop?.isOver && "bg-primary/5 ring-2 ring-primary ring-inset"
      )}
    >
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
      <EntryMenu
        path={item.path}
        disabled={disabled}
        messages={m}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </li>
  )
}
