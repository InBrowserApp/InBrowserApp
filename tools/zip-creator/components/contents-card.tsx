import { useRef, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FolderPlus, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../format"
import { ContentsRow } from "./contents-row"
import { DirectoryNav } from "./directory-nav"
import { EntryDialog } from "./entry-dialog"

import type { EntryAction } from "./entry-dialog"
import type { Messages } from "../types"
import type { Creator } from "../use-zip-creator"
import type { ZipDrag } from "../use-zip-drag"

const pageSize = 50

export function ContentsCard({
  creator: c,
  messages: m,
  lang,
  drag,
}: {
  creator: Creator
  messages: Messages
  lang: string
  drag: ZipDrag
}) {
  const [action, setAction] = useState<EntryAction | null>(null)
  const newFolder = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  const [page, setPage] = useState(0)
  const current = c.directory
  const rows = c.index.directories.get(current) ?? []
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pages - 1)
  const disabled = c.status !== null
  const number = new Intl.NumberFormat(lang)
  const drop = drag.dropTarget(current, "contents")

  function navigate(path: string) {
    c.navigate(path)
    setPage(0)
  }

  function openEntry(next: EntryAction, trigger = newFolder.current) {
    returnFocus.current = trigger
    setAction(next)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{m.contentsTitle}</CardTitle>
          <div className="flex flex-wrap gap-1">
            <Button
              ref={newFolder}
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={disabled}
              onClick={() => openEntry({ kind: "new-folder" })}
            >
              <FolderPlus aria-hidden="true" data-icon="inline-start" />
              {m.newFolder}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11"
              disabled={disabled || !c.items.length}
              onClick={() => {
                c.remove()
                navigate("")
              }}
            >
              <Trash2 aria-hidden="true" data-icon="inline-start" />
              {m.clear}
            </Button>
          </div>
        </div>
        <CardDescription>{m.contentsDescription}</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2 tabular-nums">
          <Badge variant="secondary">
            {m.files}: {number.format(c.index.files)}
          </Badge>
          <Badge variant="secondary">
            {m.folders}: {number.format(c.index.folders)}
          </Badge>
          <Badge variant="outline">
            {m.totalSize}: <bdi>{formatBytes(c.index.bytes, lang)}</bdi>
          </Badge>
        </div>
      </CardHeader>
      <CardContent
        {...drop.props}
        className={cn(
          "flex flex-col gap-3 rounded-lg",
          drop.isOver && "bg-primary/5 ring-2 ring-primary ring-inset"
        )}
      >
        <DirectoryNav
          directory={current}
          disabled={disabled}
          messages={m}
          onNavigate={navigate}
          drag={drag}
        />
        {c.items.length ? (
          <>
            {rows.length ? (
              <ul
                aria-label={m.contentsTitle}
                className="max-h-96 overflow-y-auto overscroll-contain rounded-lg border p-1"
              >
                {rows
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map((item) => (
                    <ContentsRow
                      key={item.path}
                      item={item}
                      disabled={disabled}
                      messages={m}
                      lang={lang}
                      onOpen={navigate}
                      onRemove={c.remove}
                      onEdit={openEntry}
                      drag={drag}
                    />
                  ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {m.emptyFolder}
              </p>
            )}
            {pages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  {m.previous}
                </Button>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {m.page
                    .replace("{page}", number.format(currentPage + 1))
                    .replace("{total}", number.format(pages))}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || currentPage === pages - 1}
                  onClick={() => setPage(currentPage + 1)}
                >
                  {m.next}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <Empty className="min-h-32 border border-dashed">
            <EmptyHeader>
              <EmptyTitle>{m.emptyTitle}</EmptyTitle>
              <EmptyDescription>{m.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {c.items.length ? (
          <p className="text-sm text-muted-foreground">{m.dragHint}</p>
        ) : null}
      </CardContent>
      {action ? (
        <EntryDialog
          action={action}
          creator={c}
          messages={m}
          onClose={() => {
            setAction(null)
            setPage(0)
          }}
          onRestoreFocus={() => {
            const trigger = returnFocus.current
            if (trigger?.isConnected) trigger.focus()
            else newFolder.current?.focus()
          }}
        />
      ) : null}
    </Card>
  )
}
