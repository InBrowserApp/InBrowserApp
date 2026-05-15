import { Button } from "@workspace/ui/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@workspace/ui/components/ui/context-menu"
import { Download, Eye, File, Folder } from "@workspace/ui/icons"
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
      <ExplorerRowShell
        selected={selectedPath === row.path}
        onClick={(event) => {
          if (isInteractiveClick(event.target)) return
          onDirectoryChange(row.path)
        }}
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
          -
        </div>
        <div role="cell" className="px-2 py-2 whitespace-nowrap">
          {formatDate(row.modifiedAt)}
        </div>
        <div
          role="cell"
          className="sticky end-0 border-s bg-card px-2 py-1.5 group-hover/archive-row:bg-muted/50 group-data-[selected=true]/archive-row:bg-muted"
        />
      </ExplorerRowShell>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <ExplorerRowShell
          selected={selectedPath === row.path}
          onClick={(event) => {
            if (isInteractiveClick(event.target)) return
            onFileSelect(row.path)
          }}
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
            className="sticky end-0 flex items-center justify-end border-s bg-card px-2 py-1.5 group-hover/archive-row:bg-muted/50 group-data-[selected=true]/archive-row:bg-muted"
          >
            <div className="flex items-center gap-0.5 rounded-md border border-transparent bg-background/70 p-0.5 transition-colors group-focus-within/archive-row:border-ring/60 group-hover/archive-row:border-border/80 group-data-[selected=true]/archive-row:border-border/80">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                aria-label={`${messages.previewTitle}: ${row.name}`}
                title={`${messages.previewTitle}: ${row.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onFileSelect(row.path)
                }}
              >
                <Eye aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground focus-visible:text-foreground"
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
          </div>
        </ExplorerRowShell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem
            onSelect={() => {
              onFileSelect(row.path)
            }}
          >
            <Eye aria-hidden="true" />
            {messages.previewTitle}
          </ContextMenuItem>
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
        data-selected={selected ? "true" : undefined}
        className={cn(
          "group/archive-row grid grid-cols-[minmax(16rem,1fr)_8rem_8rem_12rem_7rem] border-b text-sm transition-colors hover:bg-muted/50 data-[selected=true]:bg-muted",
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
        "flex max-w-full items-center gap-2 rounded-md text-start outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
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

function isInteractiveClick(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("button,a"))
    : false
}

export { ExplorerTableRow }
