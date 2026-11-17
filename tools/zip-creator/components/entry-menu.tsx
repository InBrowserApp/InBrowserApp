import { useRef } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  FolderInput,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "@workspace/ui/icons"

import { itemName } from "../core/collection"

import type { EntryAction } from "./entry-dialog"
import type { Messages } from "../types"

export function EntryMenu({
  path,
  disabled,
  messages: m,
  onEdit,
  onRemove,
  lang,
}: {
  path: string
  disabled: boolean
  messages: Messages
  lang: string
  onEdit: (action: EntryAction, trigger?: HTMLButtonElement | null) => void
  onRemove: (path: string) => void
}) {
  const label = m.actions.replace("{name}", itemName(path))
  const trigger = useRef<HTMLButtonElement>(null)
  const editing = useRef(false)
  function edit(kind: "rename" | "move") {
    editing.current = true
    onEdit({ kind, path }, trigger.current)
  }
  return (
    <DropdownMenu dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={trigger}
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          disabled={disabled}
          aria-label={label}
          title={label}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 max-w-[calc(100vw-2rem)]"
        onCloseAutoFocus={(event) => {
          if (editing.current) event.preventDefault()
          editing.current = false
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="min-h-11"
            onSelect={() => edit("rename")}
          >
            <Pencil aria-hidden="true" />
            {m.rename}
          </DropdownMenuItem>
          <DropdownMenuItem className="min-h-11" onSelect={() => edit("move")}>
            <FolderInput aria-hidden="true" />
            {m.move}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            variant="destructive"
            onSelect={() => onRemove(path)}
          >
            <Trash2 aria-hidden="true" />
            <span
              className="truncate"
              title={m.remove.replace("{name}", itemName(path))}
            >
              {m.remove.replace("{name}", itemName(path))}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
