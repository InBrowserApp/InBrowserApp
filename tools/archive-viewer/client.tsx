import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { TriangleAlert } from "@workspace/ui/icons"

import { ExplorerCard } from "./components/explorer-card"
import { PreviewCard } from "./components/preview-card"
import { SummaryStrip } from "./components/summary-strip"
import { UploadCard } from "./components/upload-card"
import { formatBytes } from "./core/format"
import { useArchiveViewer } from "./use-archive-viewer"
import "./highlight.css"

import type { ArchiveViewerMessages } from "./types"

type ArchiveViewerClientProps = Readonly<{
  messages: ArchiveViewerMessages
}>

function ArchiveViewerClient({ messages }: ArchiveViewerClientProps) {
  const viewer = useArchiveViewer(messages)

  return (
    <div className="flex flex-col gap-6">
      <UploadCard
        accept={viewer.accept}
        archiveName={viewer.archiveFile?.name ?? null}
        archiveSize={viewer.archiveSize}
        inputRef={viewer.fileInputRef}
        isDragging={viewer.isDragging}
        isParsing={viewer.isParsing}
        messages={messages}
        onClear={() => {
          void viewer.clearArchive()
        }}
        onDragEnter={viewer.handleDragEnter}
        onDragLeave={viewer.handleDragLeave}
        onDragOver={viewer.handleDragOver}
        onDrop={viewer.handleDrop}
        onInputChange={viewer.handleInputChange}
        onPickFile={viewer.pickFile}
      />

      {viewer.isParsing ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm"
        >
          <Spinner aria-hidden="true" />
          <span>{messages.parsingArchive}</span>
        </div>
      ) : null}

      {viewer.errorMessage ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{viewer.errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <SummaryStrip
        archiveSize={viewer.archiveSize ?? "0 B"}
        handle={viewer.archiveHandle}
        messages={messages}
        summary={viewer.summary}
        uncompressedSize={formatBytes(viewer.summary.uncompressedSize)}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <ExplorerCard
          currentDirectory={viewer.currentDirectory}
          hasArchive={Boolean(viewer.archiveHandle)}
          isParsing={viewer.isParsing}
          messages={messages}
          rows={viewer.visibleRows}
          search={viewer.search}
          selectedPath={viewer.selectedPath}
          onDirectoryChange={viewer.handleDirectoryChange}
          onFileDownload={viewer.handleEntryDownload}
          onFileSelect={viewer.handleFileSelect}
          onSearchChange={viewer.setSearch}
        />
        <PreviewCard
          entry={viewer.selectedEntry}
          messages={messages}
          preview={viewer.preview}
          textDownloadUrl={viewer.textDownloadUrl}
        />
      </div>
    </div>
  )
}

export default ArchiveViewerClient
