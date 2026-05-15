import { useEffect, useMemo, useRef, useState } from "react"
import * as exifr from "exifr"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { TriangleAlert } from "@workspace/ui/icons"

import { ImageSummary } from "./components/image-summary"
import { MetadataResults } from "./components/metadata-results"
import { UploadCard } from "./components/upload-card"
import { useObjectUrl } from "./client/object-url"
import {
  formatBytes,
  getMetadataFieldCount,
  getVisibleMetadataGroups,
  groupMetadata,
  isSupportedImageFile,
  metadataToJson,
  normalizeMetadata,
} from "./core/metadata"
import type { ExifViewerMessages } from "./client/types"
import type { MetadataRecord } from "./core/metadata"

type ExifViewerClientProps = Readonly<{
  language: string
  messages: ExifViewerMessages
}>

const EXIF_PARSE_OPTIONS = {
  exif: true,
  gps: true,
  icc: true,
  ihdr: true,
  iptc: true,
  jfif: true,
  reviveValues: true,
  translateKeys: true,
  translateValues: true,
  xmp: true,
} as const

const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/png,image/heic,image/heif,image/tiff,image/webp,image/gif"

function ExifViewerClient({ language, messages }: ExifViewerClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const runIdRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<MetadataRecord | null>(null)
  const [error, setError] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const imageUrl = useObjectUrl(selectedFile)

  const groups = useMemo(
    () => getVisibleMetadataGroups(groupMetadata(metadata ?? {})),
    [metadata]
  )
  const fieldCount = useMemo(() => getMetadataFieldCount(groups), [groups])
  const metadataJson = useMemo(
    () => (metadata ? metadataToJson(metadata) : ""),
    [metadata]
  )
  const showAmap = language.startsWith("zh")

  useEffect(() => {
    if (!selectedFile) {
      runIdRef.current += 1
      setMetadata(null)
      setIsReading(false)
      return
    }

    const fileToRead = selectedFile
    const currentRun = (runIdRef.current += 1)
    setIsReading(true)
    setError("")
    setMetadata(null)

    async function readMetadata() {
      try {
        const parsed = (await exifr.parse(fileToRead, EXIF_PARSE_OPTIONS)) as
          | MetadataRecord
          | undefined

        if (currentRun !== runIdRef.current) {
          return
        }

        setMetadata(normalizeMetadata(parsed))
      } catch (parseError) {
        if (currentRun !== runIdRef.current) {
          return
        }

        setError(toErrorMessage(parseError, messages.parseError))
        setMetadata(null)
      } finally {
        if (currentRun === runIdRef.current) {
          setIsReading(false)
        }
      }
    }

    void readMetadata()
  }, [messages.parseError, selectedFile])

  function openFilePicker() {
    inputRef.current?.click()
  }

  function clearFile() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    setMetadata(null)
    setError("")
  }

  function selectFile(file: File | null) {
    dragDepthRef.current = 0
    setIsDraggingOver(false)

    if (!file) {
      return
    }

    if (!isSupportedImageFile(file)) {
      clearFile()
      setError(messages.unsupportedFile)
      return
    }

    setError("")
    setSelectedFile(file)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDraggingOver(true)
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDraggingOver(false)
    }
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        accept={ACCEPTED_IMAGE_TYPES}
        aria-label={messages.dragDropOrClick}
        className="sr-only"
        data-testid="image-input"
        onChange={handleFileChange}
        type="file"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard>
            <ToolPanelCardContent className="gap-5">
              {selectedFile ? (
                <ImageSummary
                  fileName={selectedFile.name}
                  fileSizeLabel={`${messages.fileSize}: ${formatBytes(
                    selectedFile.size
                  )}`}
                  imageUrl={imageUrl}
                  isDraggingOver={isDraggingOver}
                  messages={messages}
                  onChangeImage={openFilePicker}
                  onRemoveImage={clearFile}
                  {...dragHandlers}
                />
              ) : (
                <UploadCard
                  isDraggingOver={isDraggingOver}
                  messages={messages}
                  onClick={openFilePicker}
                  {...dragHandlers}
                />
              )}
            </ToolPanelCardContent>
          </ToolPanelCard>
        </div>

        <ToolPanelCard>
          <ToolPanelCardContent className="gap-5">
            <MetadataResults
              categoryCount={groups.length}
              fieldCount={fieldCount}
              groups={groups}
              isLoading={isReading}
              metadata={metadata}
              metadataJson={metadataJson}
              messages={messages}
              showAmap={showAmap}
            />
          </ToolPanelCardContent>
        </ToolPanelCard>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default ExifViewerClient
