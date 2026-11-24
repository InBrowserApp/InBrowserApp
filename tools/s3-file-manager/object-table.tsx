import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  ArrowLeftRight,
  Download,
  MoreHorizontal,
  Eye,
  File,
  Folder,
  LoaderCircle,
  Trash2,
} from "@workspace/ui/icons"

import type { Labels, Listing } from "./model"
import type { ObjectAction } from "./object-dialog"

export function ObjectTable({
  listing,
  prefix,
  filter,
  selected,
  loading,
  error,
  labels,
  lang,
  navigate,
  onSelectionChange,
  setAction,
  download,
  loadMore,
}: {
  listing: Listing
  prefix: string
  filter: string
  selected: string[]
  loading: boolean
  error: string
  labels: Labels
  lang: string
  navigate: (path: string) => void
  onSelectionChange: (keys: string[]) => void
  setAction: (action: ObjectAction) => void
  download: (key: string) => Promise<void>
  loadMore: () => void
}) {
  const query = filter.toLocaleLowerCase(lang)
  const objectName = (key: string) => key.slice(prefix.length) || key
  const folders = listing.folders.filter((path) =>
    path.slice(prefix.length).toLocaleLowerCase(lang).includes(query)
  )
  const objects = listing.objects.filter(({ key }) =>
    objectName(key).toLocaleLowerCase(lang).includes(query)
  )
  const keys = objects.map(({ key }) => key)
  const all = keys.length > 0 && keys.every((key) => selected.includes(key))
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })
  const units = ["B", "KiB", "MiB", "GiB", "TiB"]
  function formatSize(bytes: number) {
    const power =
      bytes < 1024
        ? 0
        : Math.min(Math.floor(Math.log2(bytes) / 10), units.length - 1)
    return `${number.format(bytes / 1024 ** power)} ${units[power]}`
  }
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "medium" })
  const check = "size-4 shrink-0 cursor-pointer accent-primary"

  return (
    <div className="min-h-72 overflow-x-auto" aria-busy={loading}>
      <table className="w-full table-fixed text-sm">
        <thead className="border-b bg-muted/45 text-xs text-muted-foreground">
          <tr>
            <th className="w-9 p-2 ps-3 text-start">
              <input
                type="checkbox"
                className={check}
                aria-label={labels.selectAll}
                checked={all}
                disabled={!keys.length}
                onChange={() =>
                  onSelectionChange(
                    all
                      ? selected.filter((key) => !keys.includes(key))
                      : [...new Set([...selected, ...keys])]
                  )
                }
              />
            </th>
            <th className="py-2 ps-2 text-start font-medium">{labels.name}</th>
            <th className="hidden w-24 px-2 text-end font-medium sm:table-cell">
              {labels.size}
            </th>
            <th className="hidden w-28 px-2 text-start font-medium lg:table-cell">
              {labels.modified}
            </th>
            <th className="w-12">
              <span className="sr-only">{labels.actions}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {folders.map((path) => (
            <tr key={"folder:" + path} className="hover:bg-muted/35">
              <td />
              <td>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={() => navigate(path)}
                >
                  <Folder className="text-amber-600 dark:text-amber-400" />
                  <bdi className="truncate">
                    {path.slice(prefix.length, -1) || "/"}
                  </bdi>
                </Button>
              </td>
              <td className="hidden sm:table-cell" />
              <td className="hidden lg:table-cell" />
              <td />
            </tr>
          ))}
          {objects.map(({ key, size, modified }) => (
            <tr key={"object:" + key} className="hover:bg-muted/35">
              <td className="p-2 ps-3">
                <input
                  type="checkbox"
                  className={check}
                  aria-label={key}
                  checked={selected.includes(key)}
                  onChange={() =>
                    onSelectionChange(
                      selected.includes(key)
                        ? selected.filter((item) => item !== key)
                        : [...selected, key]
                    )
                  }
                />
              </td>
              <td>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={() => setAction({ kind: "details", key })}
                >
                  <File className="text-muted-foreground" />
                  <bdi className="truncate">{objectName(key)}</bdi>
                </Button>
              </td>
              <td className="hidden px-2 text-end text-xs text-muted-foreground tabular-nums sm:table-cell">
                {size === undefined ? "—" : formatSize(size)}
              </td>
              <td className="hidden px-2 text-xs text-muted-foreground lg:table-cell">
                {modified ? date.format(modified) : "—"}
              </td>
              <td className="pe-2 text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`${labels.actions} · ${key}`}
                      title={labels.actions}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-max max-w-[calc(100vw-2rem)]"
                  >
                    <DropdownMenuItem
                      onSelect={() => setAction({ kind: "details", key })}
                    >
                      <Eye />
                      {labels.details}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => void download(key)}>
                      <Download />
                      {labels.download}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setAction({ kind: "copy", key })}
                    >
                      <ArrowLeftRight />
                      {labels.copyMove}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() =>
                        setAction({ kind: "delete", keys: [key] })
                      }
                    >
                      <Trash2 />
                      {labels.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!folders.length && !objects.length && (
        <div className="grid min-h-56 place-items-center p-5 text-sm text-muted-foreground">
          {loading ? (
            <span role="status" className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" />
              {labels.loading}
            </span>
          ) : error ? null : filter ? (
            labels.noMatches
          ) : (
            labels.emptyFolder
          )}
        </div>
      )}
      {listing.next && (
        <div className="flex justify-center border-t p-3">
          <Button variant="outline" disabled={loading} onClick={loadMore}>
            {loading && <LoaderCircle className="animate-spin" />}
            {labels.loadMore}
          </Button>
        </div>
      )}
    </div>
  )
}
