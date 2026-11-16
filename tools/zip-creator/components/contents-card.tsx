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
import { Trash2 } from "@workspace/ui/icons"

import { formatBytes } from "../format"
import { ContentsRow } from "./contents-row"
import { DirectoryNav } from "./directory-nav"

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
            {m.totalSize}: <bdi>{formatBytes(c.index.bytes, lang)}</bdi>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {c.items.length ? (
          <>
            <DirectoryNav
              directory={current}
              disabled={disabled}
              messages={m}
              onNavigate={navigate}
            />
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
      </CardContent>
    </Card>
  )
}
