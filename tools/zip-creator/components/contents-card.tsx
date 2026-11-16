import { useState } from "react"

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
import { ArrowUp, File, Folder, Trash2, X } from "@workspace/ui/icons"

import { formatBytes } from "../format"

import type { Messages } from "../types"
import type { Creator } from "../use-zip-creator"

const pageSize = 50

export function ContentsCard({
  creator: c,
  messages: m,
  lang,
}: {
  creator: Creator
  messages: Messages
  lang: string
}) {
  const [directory, setDirectory] = useState("")
  const [page, setPage] = useState(0)
  const current = c.items.some((item) => item.path === directory && !item.file)
    ? directory
    : ""
  const rows = c.index.directories.get(current) ?? []
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pages - 1)
  const disabled = c.status !== null
  const number = new Intl.NumberFormat(lang)

  function navigate(path: string) {
    setDirectory(path)
    setPage(0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{m.contentsTitle}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
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
        <CardDescription>{m.contentsDescription}</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2 tabular-nums">
          <Badge variant="secondary">
            {m.files}: {number.format(c.index.files)}
          </Badge>
          <Badge variant="secondary">
            {m.folders}: {number.format(c.index.folders)}
          </Badge>
          <Badge variant="outline">
            {m.totalSize}: {formatBytes(c.index.bytes, lang)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {c.items.length ? (
          <>
            <nav
              aria-label={m.contentsTitle}
              className="flex min-w-0 flex-wrap items-center gap-2 text-sm"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || !current}
                onClick={() =>
                  navigate(
                    current.slice(0, Math.max(0, current.lastIndexOf("/")))
                  )
                }
                aria-label={m.goUp}
              >
                <ArrowUp aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || !current}
                onClick={() => navigate("")}
              >
                {m.root}
              </Button>
              {current ? (
                <bdi className="min-w-0 break-all" aria-current="location">
                  / {current}
                </bdi>
              ) : null}
            </nav>
            {rows.length ? (
              <ul
                aria-label={m.contentsTitle}
                className="max-h-96 overflow-y-auto overscroll-contain rounded-lg border p-1"
              >
                {rows
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map((item) => {
                    const name = item.path.slice(item.path.lastIndexOf("/") + 1)
                    return (
                      <li
                        key={item.path}
                        className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
                      >
                        {item.file ? (
                          <File
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        ) : (
                          <Folder
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        )}
                        {item.file ? (
                          <bdi
                            className="min-w-0 flex-1 truncate text-sm"
                            title={name}
                          >
                            {name}
                          </bdi>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={disabled}
                            onClick={() => navigate(item.path)}
                            className="min-w-0 flex-1 justify-start px-1"
                          >
                            <bdi className="truncate" title={name}>
                              {name}
                            </bdi>
                          </Button>
                        )}
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {item.file
                            ? formatBytes(item.file.size, lang)
                            : m.folder}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={disabled}
                          aria-label={m.remove.replace("{name}", name)}
                          onClick={() => c.remove(item.path)}
                        >
                          <X aria-hidden="true" />
                        </Button>
                      </li>
                    )
                  })}
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
      </CardContent>
    </Card>
  )
}
