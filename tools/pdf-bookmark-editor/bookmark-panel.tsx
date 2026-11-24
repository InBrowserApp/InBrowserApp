import { useEffect, useId, useRef } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  ArrowDown,
  ArrowUp,
  Bookmark as BookmarkIcon,
  IndentDecrease,
  IndentIncrease,
  Plus,
  Trash2,
  Undo2,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { availableMoves, type Bookmark, type Move } from "./core/bookmarks"
import type { Messages } from "./client"
import { PageInput } from "./page-input"

const moves = [
  { action: "up", label: "moveUp", Icon: ArrowUp },
  { action: "down", label: "moveDown", Icon: ArrowDown },
  { action: "indent", label: "indent", Icon: IndentIncrease },
  { action: "outdent", label: "outdent", Icon: IndentDecrease },
] as const

type Props = {
  bookmarks: Bookmark[]
  selectedIndex: number
  total: number
  previewPage: number
  messages: Messages
  undo: (() => void) | null
  onSelect: (bookmark: Bookmark) => void
  onAdd: () => void
  onDelete: () => void
  onMove: (move: Move) => void
  onTitle: (title: string) => void
  onPage: (page: number) => void
}

export function BookmarkPanel({
  bookmarks,
  selectedIndex,
  total,
  previewPage,
  messages,
  undo,
  onSelect,
  onAdd,
  onDelete,
  onMove,
  onTitle,
  onPage,
}: Props) {
  const selected = bookmarks[selectedIndex]
  const canMove = selected ? availableMoves(bookmarks, selectedIndex) : null
  const titleId = useId()
  const destinationId = useId()
  const titleInput = useRef<HTMLInputElement>(null)
  const focusTitleOnAdd = useRef(false)
  const list = useRef<HTMLUListElement>(null)
  const activeRow = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (focusTitleOnAdd.current) {
      titleInput.current?.focus({ preventScroll: true })
      titleInput.current?.select()
      focusTitleOnAdd.current = false
    }
    const container = list.current
    const row = activeRow.current
    if (container && row) {
      if (row.offsetTop < container.scrollTop)
        container.scrollTop = row.offsetTop
      const bottom = row.offsetTop + row.offsetHeight
      if (bottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = bottom - container.clientHeight
      }
    }
  }, [selected?.id, selectedIndex])

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <CardTitle>{messages.bookmarks}</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="max-w-full whitespace-normal"
          onClick={() => {
            focusTitleOnAdd.current = true
            onAdd()
          }}
        >
          <Plus data-icon="inline-start" aria-hidden="true" />
          {messages.addBookmark}
        </Button>
      </CardHeader>
      {bookmarks.length ? (
        <ul
          ref={list}
          aria-label={messages.bookmarks}
          className="relative max-h-52 min-h-32 space-y-1 overflow-y-auto border-t px-3 py-2 sm:max-h-72"
        >
          {bookmarks.map((bookmark, index) => {
            const active = index === selectedIndex
            const title = bookmark.title || messages.untitled
            return (
              <li
                key={bookmark.id}
                ref={active ? activeRow : undefined}
                style={{
                  paddingInlineStart: `${Math.min(bookmark.depth, 7) * 0.75}rem`,
                }}
              >
                <button
                  type="button"
                  title={title}
                  aria-current={active || undefined}
                  onClick={(event) => {
                    onSelect(bookmark)
                    if (event.detail === 0) titleInput.current?.focus()
                  }}
                  className={cn(
                    "flex min-h-9 w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <BookmarkIcon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <bdi className="min-w-0 flex-1 truncate">{title}</bdi>
                  {bookmark.page !== null && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {messages.pageBookmark.replace(
                        "{page}",
                        String(bookmark.page)
                      )}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="border-t px-4 py-8 text-sm text-muted-foreground sm:px-5">
          {messages.noBookmarks}
        </p>
      )}
      {(selected || undo) && (
        <CardContent className="flex flex-col gap-4 border-t px-4 py-4 sm:px-5">
          {selected && (
            <>
              <div className="grid gap-2">
                <Label htmlFor={titleId}>{messages.bookmarkTitle}</Label>
                <Input
                  ref={titleInput}
                  id={titleId}
                  dir="auto"
                  value={selected.title}
                  placeholder={messages.untitled}
                  onChange={(event) => onTitle(event.currentTarget.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={destinationId}>
                  {messages.destinationPage}
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  <PageInput
                    id={destinationId}
                    key={selected.id}
                    value={selected.page}
                    total={total}
                    onPage={onPage}
                    label={messages.destinationPage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="max-w-full whitespace-normal"
                    onClick={() => onPage(previewPage)}
                  >
                    {messages.usePreviewPage}
                  </Button>
                </div>
                {selected.page === null && (
                  <p className="text-xs text-muted-foreground">
                    {messages.originalDestination}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {moves.map(({ action, label, Icon }) => (
                  <Button
                    key={action}
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="max-sm:size-10"
                    title={messages[label]}
                    aria-label={messages[label]}
                    disabled={!canMove?.[action]}
                    onClick={() => onMove(action)}
                  >
                    <Icon
                      className={
                        action === "indent" || action === "outdent"
                          ? "rtl:-scale-x-100"
                          : undefined
                      }
                      aria-hidden="true"
                    />
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title={messages.deleteBookmark}
                  aria-label={messages.deleteBookmark}
                  onClick={onDelete}
                  className="ms-auto text-destructive hover:text-destructive max-sm:size-10"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
          {undo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={undo}
            >
              <Undo2 data-icon="inline-start" aria-hidden="true" />
              {messages.undoDelete}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}
