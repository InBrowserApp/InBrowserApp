import { useEffect, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, TriangleAlert, Wrench } from "@workspace/ui/icons"

import { stripImageMetadata } from "./core/strip-image-metadata"
import { UploadDropzone } from "./components/upload-dropzone"
import { formatBytes, formatToMime, toErrorMessage } from "./client/utils"
import type { ImageMetadataCleanerMessages } from "./client/types"

type ImageMetadataCleanerClientProps = Readonly<{
  messages: ImageMetadataCleanerMessages
}>

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  return url
}

function ImageMetadataCleanerClient({
  messages,
}: ImageMetadataCleanerClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null)
  const [removedBytes, setRemovedBytes] = useState(0)
  const [error, setError] = useState("")
  const [isCleaning, setIsCleaning] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const selectedFileUrl = useObjectUrl(selectedFile)
  const cleanedFileUrl = useObjectUrl(cleanedBlob)
  const reductionPercent =
    selectedFile && selectedFile.size > 0
      ? Math.max(0, Math.round((removedBytes / selectedFile.size) * 100))
      : 0
  const downloadName = selectedFile?.name || "cleaned-image"

  function selectFile(file: File | null) {
    setSelectedFile(file)
    resetResults()
  }

  function resetResults() {
    setCleanedBlob(null)
    setRemovedBytes(0)
    setError("")
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  function handleClear() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    resetResults()
  }

  function openFilePicker() {
    inputRef.current?.click()
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
    dragDepthRef.current = 0
    setIsDraggingOver(false)

    const file = event.dataTransfer.files?.[0] ?? null
    if (!file) {
      return
    }

    selectFile(file)
  }

  async function handleCleanMetadata() {
    if (!selectedFile || isCleaning) {
      return
    }

    setIsCleaning(true)
    resetResults()

    try {
      const input = new Uint8Array(await selectedFile.arrayBuffer())
      const result = stripImageMetadata(input)
      const mimeType = selectedFile.type || formatToMime(result.format)
      const cleanedBytes = Uint8Array.from(result.cleaned)

      setCleanedBlob(new Blob([cleanedBytes.buffer], { type: mimeType }))
      setRemovedBytes(result.removedBytes)
    } catch (cleanError) {
      setError(toErrorMessage(cleanError, messages))
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ToolPanelCard>
          <ToolPanelCardContent className="gap-5">
            <UploadDropzone
              isDraggingOver={isDraggingOver}
              messages={messages}
              onClick={openFilePicker}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") {
                  return
                }

                event.preventDefault()
                openFilePicker()
              }}
            />

            <input
              ref={inputRef}
              aria-label={messages.dragDropOrClick}
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
              type="file"
            />

            {selectedFile && selectedFileUrl ? (
              <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <img
                  alt={selectedFile.name}
                  className="aspect-square w-full rounded-xl border bg-muted object-contain p-2"
                  src={selectedFileUrl}
                />
                <div className="space-y-2">
                  <p className="font-medium break-all">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
            ) : null}
          </ToolPanelCardContent>

          {selectedFile ? (
            <ToolPanelCardFooter className="justify-end">
              <Button onClick={handleClear} type="button" variant="outline">
                {messages.remove}
              </Button>
            </ToolPanelCardFooter>
          ) : null}
        </ToolPanelCard>

        <ToolPanelCard>
          <ToolPanelCardContent className="gap-5">
            <div className="space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Wrench className="size-5" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading text-base font-medium">
                  {messages.cleanMetadata}
                </h2>
                <p className="text-sm text-muted-foreground">{messages.note}</p>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!selectedFile || isCleaning}
              onClick={() => {
                void handleCleanMetadata()
              }}
              type="button"
            >
              {isCleaning ? messages.cleaningMetadata : messages.cleanMetadata}
            </Button>

            {selectedFile && cleanedBlob ? (
              <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-xl border bg-muted/30 p-3">
                  <dt className="text-muted-foreground">{messages.removed}</dt>
                  <dd className="mt-1 text-lg font-medium">
                    {formatBytes(removedBytes)}
                  </dd>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3">
                  <dt className="text-muted-foreground">
                    {messages.reduction}
                  </dt>
                  <dd className="mt-1 text-lg font-medium">
                    {reductionPercent}%
                  </dd>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3 sm:col-span-2 xl:col-span-1">
                  <dt className="text-muted-foreground">{messages.fileSize}</dt>
                  <dd className="mt-1 text-lg font-medium">
                    {formatBytes(cleanedBlob.size)} /{" "}
                    {formatBytes(selectedFile.size)}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                {messages.results}
              </div>
            )}
          </ToolPanelCardContent>
        </ToolPanelCard>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {selectedFile && cleanedBlob && selectedFileUrl && cleanedFileUrl ? (
        <ToolPanelCard>
          <ToolPanelCardContent className="gap-5">
            <div className="space-y-1">
              <h2 className="font-heading text-base font-medium">
                {messages.results}
              </h2>
              <p className="text-sm text-muted-foreground">
                {messages.cleaningComplete}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedFile.name}
                </p>
                <div className="overflow-hidden rounded-xl border bg-muted/30">
                  <img
                    alt={messages.meta.name}
                    className="aspect-video w-full object-contain"
                    src={selectedFileUrl}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {messages.downloadCleaned}
                </p>
                <div className="overflow-hidden rounded-xl border bg-muted/30">
                  <img
                    alt={messages.downloadCleaned}
                    className="aspect-video w-full object-contain"
                    src={cleanedFileUrl}
                  />
                </div>
              </div>
            </div>
          </ToolPanelCardContent>

          <ToolPanelCardFooter className="justify-end">
            <Button asChild>
              <a download={downloadName} href={cleanedFileUrl}>
                <Download className="size-4" />
                {messages.downloadCleaned}
              </a>
            </Button>
          </ToolPanelCardFooter>
        </ToolPanelCard>
      ) : null}
    </div>
  )
}

export default ImageMetadataCleanerClient
