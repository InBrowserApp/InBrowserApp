import { Button } from "@workspace/ui/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@workspace/ui/components/ui/context-menu"
import { Download, File, Folder } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes, formatDate, getKindLabel } from "../core/format"

import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import type { ArchiveExplorerRow } from "../core/explorer"
import type { ArchiveEntryKind } from "../core/types"
import type { ArchiveViewerMessages } from "../types"

type ExplorerTableRowProps = Readonly<{
  kindLabels: Record<ArchiveEntryKind, string>
  messages: ArchiveViewerMessages
  row: ArchiveExplorerRow
  selectedPath: string
  onDirectoryChange: (path: string) => void
  onFileDownload: (path: string) => void
  onFileSelect: (path: string) => void
}>

function ExplorerTableRow({
  kindLabels,
  messages,
  row,
  selectedPath,
  onDirectoryChange,
  onFileDownload,
  onFileSelect,
}: ExplorerTableRowProps) {
  if (row.kind !== "file") {
    return (
      <ExplorerRowShell selected={selectedPath === row.path}>
        <div role="cell" className="min-w-0 px-2 py-2">
          <EntryButton
            messages={messages}
            row={row}
            onDirectoryChange={onDirectoryChange}
            onFileSelect={onFileSelect}
          />
        </div>
        <div role="cell" className="px-2 py-2 whitespace-nowrap">
          {getKindLabel(row.kind, kindLabels)}
        </div>
        <div role="cell" className="px-2 py-2 whitespace-nowrap">
          -
        </div>
        <div role="cell" className="px-2 py-2 whitespace-nowrap">
          {formatDate(row.modifiedAt)}
        </div>
        <div
          role="cell"
          className="sticky right-0 border-l bg-background px-2 py-1.5"
        />
      </ExplorerRowShell>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <ExplorerRowShell
          selected={selectedPath === row.path}
          onContextMenu={() => onFileSelect(row.path)}
        >
          <div role="cell" className="min-w-0 px-2 py-2">
            <EntryButton
              messages={messages}
              row={row}
              onDirectoryChange={onDirectoryChange}
              onFileSelect={onFileSelect}
            />
          </div>
          <div role="cell" className="px-2 py-2 whitespace-nowrap">
            {getKindLabel(row.kind, kindLabels)}
          </div>
          <div role="cell" className="px-2 py-2 whitespace-nowrap">
            {formatBytes(row.size)}
          </div>
          <div role="cell" className="px-2 py-2 whitespace-nowrap">
            {formatDate(row.modifiedAt)}
          </div>
          <div
            role="cell"
            className="sticky right-0 flex justify-center border-l bg-background px-2 py-1.5"
          >
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={`${messages.downloadEntry}: ${row.name}`}
              title={`${messages.downloadEntry}: ${row.name}`}
              onClick={(event) => {
                event.stopPropagation()
                onFileDownload(row.path)
              }}
            >
              <Download aria-hidden="true" />
            </Button>
          </div>
        </ExplorerRowShell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem
            onSelect={() => {
              onFileDownload(row.path)
            }}
          >
            <Download aria-hidden="true" />
            {messages.downloadEntry}
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const ExplorerRowShell = forwardRef<HTMLDivElement, ExplorerRowShellProps>(
  function ExplorerRowShell({ children, className, selected, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="row"
        className={cn(
          "grid grid-cols-[minmax(13rem,1fr)_7rem_7rem_11rem_4rem] border-b text-sm transition-colors hover:bg-muted/50",
          selected && "bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

type ExplorerRowShellProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    children: ReactNode
    selected: boolean
  }>

function EntryButton({
  messages,
  row,
  onDirectoryChange,
  onFileSelect,
}: Readonly<{
  messages: ArchiveViewerMessages
  row: ArchiveExplorerRow
  onDirectoryChange: (path: string) => void
  onFileSelect: (path: string) => void
}>) {
  return (
    <button
      type="button"
      className={cn(
        "flex max-w-full items-center gap-2 rounded-md text-left outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
        row.kind === "file" && "font-medium"
      )}
      onClick={() => {
        if (row.kind === "directory") {
          onDirectoryChange(row.path)
        } else {
          onFileSelect(row.path)
        }
      }}
      aria-label={
        row.kind === "directory"
          ? `${messages.openFolder}: ${row.name}`
          : `${messages.previewFile}: ${row.name}`
      }
    >
      {row.kind === "directory" ? (
        <Folder aria-hidden="true" />
      ) : (
        <File aria-hidden="true" />
      )}
      <span className="truncate">{row.name}</span>
    </button>
  )
}

export { ExplorerTableRow }
