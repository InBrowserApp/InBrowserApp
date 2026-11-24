import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  X,
} from "@workspace/ui/icons"
import type { Sort } from "../core/table"
import { message, type Messages } from "../messages"

export function ColumnMenu({
  name,
  dir,
  direction,
  changeSort,
  rename,
  moveEarlier,
  moveLater,
  messages: m,
}: {
  name: string
  dir: "ltr" | "rtl"
  direction: Sort["direction"] | undefined
  changeSort: (direction: Sort["direction"] | null) => void
  rename: (() => void) | undefined
  moveEarlier: (() => void) | undefined
  moveLater: (() => void) | undefined
  messages: Messages
}) {
  const SortIcon = direction === "ascending" ? ArrowUp : ArrowDown
  const label = message(m.columnActions, { column: name })
  return (
    <DropdownMenu dir={dir} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={label}
          title={label}
          data-column-menu
          className="min-w-0 flex-1 justify-between px-1.5 text-sm"
        >
          <bdi className="max-w-52 truncate">{name}</bdi>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
            {direction && <SortIcon className="size-3.5" aria-hidden="true" />}
            <MoreHorizontal aria-hidden="true" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-44 data-closed:animate-none"
      >
        <DropdownMenuItem onSelect={() => changeSort("ascending")}>
          <ArrowUp aria-hidden="true" /> {m.sortAscending}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => changeSort("descending")}>
          <ArrowDown aria-hidden="true" /> {m.sortDescending}
        </DropdownMenuItem>
        {direction && (
          <DropdownMenuItem onSelect={() => changeSort(null)}>
            <X aria-hidden="true" /> {m.clearSort}
          </DropdownMenuItem>
        )}
        {rename && (
          <DropdownMenuItem onSelect={rename}>
            <Pencil aria-hidden="true" /> {m.renameColumn}
          </DropdownMenuItem>
        )}
        {(moveEarlier || moveLater) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!moveEarlier} onSelect={moveEarlier}>
              <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />{" "}
              {m.moveEarlier}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!moveLater} onSelect={moveLater}>
              <ChevronRight className="rtl:rotate-180" aria-hidden="true" />{" "}
              {m.moveLater}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
