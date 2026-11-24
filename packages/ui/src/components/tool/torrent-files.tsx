import { fileSizeFormatter } from "@workspace/ui/lib/format-file-size"
import { useId, useState, type ReactNode } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { FileText, Search } from "@workspace/ui/icons"
import type { TorrentMessages } from "./torrent-types"

const PAGE_SIZE = 50

function TorrentFiles<File extends { path: string; length: number }>({
  files,
  messages: m,
  language,
  actions,
}: {
  files: File[]
  messages: Pick<
    TorrentMessages,
    "files" | "filter" | "path" | "size" | "noMatches" | "previous" | "next"
  >
  language: string
  actions?: { heading: string; render: (file: File) => ReactNode }
}) {
  const id = useId()
  const formatSize = fileSizeFormatter(language)
  const formatNumber = new Intl.NumberFormat(language)
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(0)
  const query = filter.trim().toLowerCase()
  const matches = query
    ? files.filter((file) => file.path.toLowerCase().includes(query))
    : files
  const start = page * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, matches.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <h2>{m.files}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="relative max-w-md">
          <label className="sr-only" htmlFor={id}>
            {m.filter}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={id}
            type="search"
            className="ps-8"
            value={filter}
            placeholder={m.filter}
            onChange={(event) => {
              setFilter(event.target.value)
              setPage(0)
            }}
          />
        </div>
        {matches.length ? (
          <div className="rounded-lg border">
            <table aria-label={m.files} className="w-full text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-2 text-start font-medium sm:px-3"
                  >
                    {m.path}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-end font-medium sm:px-3"
                  >
                    {m.size}
                  </th>
                  {actions ? (
                    <th
                      scope="col"
                      className="px-2 py-2 text-end font-medium sm:px-3"
                    >
                      {actions.heading}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y">
                {matches.slice(start, end).map((file, index) => (
                  <tr key={start + index}>
                    <td className="px-2 py-2 wrap-anywhere sm:px-3">
                      <bdi>{file.path}</bdi>
                    </td>
                    <td className="px-2 py-2 text-end whitespace-nowrap tabular-nums sm:px-3">
                      {formatSize(file.length)}
                    </td>
                    {actions ? (
                      <td className="px-2 py-2 text-end sm:px-3">
                        {actions.render(file)}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            {m.noMatches}
          </p>
        )}
        {matches.length > PAGE_SIZE ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className="text-sm text-muted-foreground tabular-nums"
              dir="ltr"
              role="status"
            >
              {formatNumber.format(start + 1)}–{formatNumber.format(end)} /{" "}
              {formatNumber.format(matches.length)}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                {m.previous}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={end === matches.length}
                onClick={() => setPage(page + 1)}
              >
                {m.next}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { TorrentFiles }
