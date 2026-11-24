import { useRef } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Database,
  ChevronDown,
  Folder,
  FolderPlus,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
} from "@workspace/ui/icons"

import type { Labels } from "./model"
import type { ObjectAction } from "./object-dialog"

export function ObjectToolbar({
  bucket,
  prefix,
  filter,
  selected,
  loading,
  labels,
  lang,
  navigate,
  setFilter,
  refresh,
  setAction,
}: {
  bucket: string
  prefix: string
  filter: string
  selected: string[]
  loading: boolean
  labels: Labels
  lang: string
  navigate: (path: string) => void
  setFilter: (filter: string) => void
  refresh: () => void
  setAction: (action: ObjectAction) => void
}) {
  const filesInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const segments = prefix ? prefix.slice(0, -1).split("/") : []
  const controls = "h-9"

  return (
    <div className="grid gap-3 border-b p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{labels.browserTitle}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            aria-label={labels.refresh}
            title={labels.refresh}
            disabled={loading}
            className={controls}
            onClick={refresh}
          >
            <RefreshCcw />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={controls}
            onClick={() => setAction({ kind: "folder" })}
          >
            <FolderPlus />
            {labels.newFolder}
          </Button>
          <div className="inline-flex items-center">
            <Button
              size="sm"
              className="h-9 rounded-e-none"
              onClick={() => filesInput.current?.click()}
            >
              <Upload />
              {labels.uploadFiles}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="h-9 w-8 rounded-s-none border-s border-primary-foreground/25"
                  aria-label={labels.uploadFolder}
                  title={labels.uploadFolder}
                >
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-max max-w-[calc(100vw-2rem)]"
              >
                <DropdownMenuItem onSelect={() => folderInput.current?.click()}>
                  <Folder />
                  {labels.uploadFolder}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <nav
          aria-label={labels.goToPath}
          dir="ltr"
          className="flex min-w-0 flex-1 flex-wrap items-center gap-1 font-mono text-xs"
        >
          <Button
            size="sm"
            variant="ghost"
            className="h-7 min-w-0 px-1.5 font-mono text-xs"
            onClick={() => navigate("")}
            aria-current={prefix ? undefined : "location"}
          >
            <Database />
            <bdi className="max-w-48 truncate">{bucket}</bdi>
          </Button>
          {segments.map((segment, index) => {
            const path = segments.slice(0, index + 1).join("/") + "/"
            return (
              <span key={path} className="flex min-w-0 items-center gap-1">
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 max-w-48 min-w-0 px-1.5 font-mono text-xs"
                  onClick={() => navigate(path)}
                  aria-current={path === prefix ? "location" : undefined}
                >
                  <bdi className="truncate">{segment || "/"}</bdi>
                </Button>
              </span>
            )
          })}
        </nav>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAction({ kind: "path" })}
        >
          {labels.goToPath}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-44 flex-1">
          <Search className="pointer-events-none absolute start-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="ps-8"
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label={labels.filter}
            placeholder={labels.filter}
          />
        </div>
        {selected.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => setAction({ kind: "delete", keys: selected })}
          >
            <Trash2 />
            {labels.delete} (
            {new Intl.NumberFormat(lang).format(selected.length)})
          </Button>
        )}
      </div>
      {[filesInput, folderInput].map((ref, index) => (
        <input
          key={index}
          ref={ref}
          type="file"
          multiple
          {...(index === 1 && { webkitdirectory: "" })}
          hidden
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? [])
            event.currentTarget.value = ""
            if (files.length) setAction({ kind: "upload", files })
          }}
        />
      ))}
    </div>
  )
}
