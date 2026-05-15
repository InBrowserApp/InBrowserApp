import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Download,
  ChevronRight,
  ChevronUp,
  Eye,
  Folder,
  Search,
} from "@workspace/ui/icons"

import { splitPathSegments, toDirectoryPath } from "../core/path"
import { ExplorerTableRow } from "./explorer-table-row"

import type { ArchiveExplorerRow } from "../core/explorer"
import type { ArchiveEntryKind } from "../core/types"
import type { ArchiveViewerMessages } from "../types"

type ExplorerCardProps = Readonly<{
  currentDirectory: string
  hasArchive: boolean
  isParsing: boolean
  messages: ArchiveViewerMessages
  rows: readonly ArchiveExplorerRow[]
  search: string
  selectedPath: string
  onDirectoryChange: (path: string) => void
  onFileDownload: (path: string) => void
  onFileSelect: (path: string) => void
  onSearchChange: (value: string) => void
}>

function ExplorerCard({
  currentDirectory,
  hasArchive,
  isParsing,
  messages,
  rows,
  search,
  selectedPath,
  onDirectoryChange,
  onFileDownload,
  onFileSelect,
  onSearchChange,
}: ExplorerCardProps) {
  const breadcrumbs = getBreadcrumbs(currentDirectory, messages.rootFolder)
  const kindLabels: Record<ArchiveEntryKind, string> = {
    file: messages.kindFile,
    directory: messages.kindDirectory,
    symlink: messages.kindSymlink,
    other: messages.kindOther,
  }

  return (
    <Card className="min-h-[32rem]">
      <CardHeader className="border-b">
        <CardTitle>{messages.explorerTitle}</CardTitle>
        <CardDescription>{messages.explorerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label={messages.explorerTitle}
            className="flex min-w-0 flex-wrap items-center gap-1 text-sm"
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <div
                key={breadcrumb.path || "root"}
                className="flex items-center gap-1"
              >
                {index > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    className="text-muted-foreground"
                  />
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDirectoryChange(breadcrumb.path)}
                  disabled={isParsing}
                >
                  {breadcrumb.name}
                </Button>
              </div>
            ))}
          </nav>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onDirectoryChange(getParentDirectory(currentDirectory))
            }
            disabled={!currentDirectory || isParsing}
          >
            <ChevronUp data-icon="inline-start" />
            {messages.goUp}
          </Button>
        </div>

        <label className="sr-only" htmlFor="archive-viewer-search">
          {messages.searchLabel}
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="archive-viewer-search"
            name="archive-viewer-search"
            autoComplete="off"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={messages.searchPlaceholder}
            className="pl-8"
          />
        </div>

        {rows.length > 0 ? (
          <div
            role="table"
            aria-label={messages.explorerTitle}
            className="min-h-0 overflow-x-auto rounded-lg border"
          >
            <div className="min-w-[51rem]">
              <div>
                <div
                  role="row"
                  className="grid grid-cols-[minmax(16rem,1fr)_8rem_8rem_12rem_6rem] border-b text-sm"
                >
                  <div
                    role="columnheader"
                    className="px-2 py-2.5 text-left font-medium whitespace-nowrap"
                  >
                    {messages.columnName}
                  </div>
                  <div
                    role="columnheader"
                    className="px-2 py-2.5 text-left font-medium whitespace-nowrap"
                  >
                    {messages.columnKind}
                  </div>
                  <div
                    role="columnheader"
                    className="px-2 py-2.5 text-left font-medium whitespace-nowrap"
                  >
                    {messages.columnSize}
                  </div>
                  <div
                    role="columnheader"
                    className="px-2 py-2.5 text-left font-medium whitespace-nowrap"
                  >
                    {messages.columnModified}
                  </div>
                  <div
                    role="columnheader"
                    className="sticky right-0 flex items-center justify-end border-l bg-card px-2 py-2.5"
                    title={`${messages.previewFile} / ${messages.downloadEntry}`}
                  >
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye aria-hidden="true" />
                      <Download aria-hidden="true" />
                    </span>
                    <span className="sr-only">
                      {messages.previewFile} / {messages.downloadEntry}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {rows.map((row) => (
                  <ExplorerTableRow
                    key={row.path}
                    kindLabels={kindLabels}
                    messages={messages}
                    row={row}
                    selectedPath={selectedPath}
                    onDirectoryChange={onDirectoryChange}
                    onFileDownload={onFileDownload}
                    onFileSelect={onFileSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Empty className="min-h-64 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Folder aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {hasArchive
                  ? messages.emptyFolderTitle
                  : messages.noArchiveTitle}
              </EmptyTitle>
              <EmptyDescription>
                {hasArchive
                  ? messages.emptyFolderDescription
                  : messages.noArchiveDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function getBreadcrumbs(currentDirectory: string, rootLabel: string) {
  const segments = splitPathSegments(currentDirectory)
  const breadcrumbs = [{ name: rootLabel, path: "" }]
  let nextSegments: string[] = []

  for (const segment of segments) {
    nextSegments = [...nextSegments, segment]
    breadcrumbs.push({
      name: segment,
      path: toDirectoryPath(nextSegments),
    })
  }

  return breadcrumbs
}

function getParentDirectory(currentDirectory: string): string {
  const segments = splitPathSegments(currentDirectory)
  segments.pop()
  return toDirectoryPath(segments)
}

export { ExplorerCard }
