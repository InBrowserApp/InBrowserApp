import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react"

import { openArchive } from "./core/archive"
import { acceptedArchiveTypes } from "./core/formats"
import { buildRowIndex, getRowsForDirectory } from "./core/explorer"
import { formatBytes, summarizeEntries } from "./core/format"
import { normalizeDirectoryPath } from "./core/path"
import type { ArchiveEntry, ArchiveHandle } from "./core/types"
import { resolveArchiveError } from "./archive-errors"
import { downloadArchiveEntry } from "./download"
import {
  cleanupLoadedPreview,
  cleanupPreview,
  loadEntryPreview,
} from "./preview-loader"

import type { PreviewState } from "./components/preview-dialog"
import type { ArchiveViewerMessages } from "./types"

const EMPTY_ENTRIES: readonly ArchiveEntry[] = []

function useArchiveViewer(messages: ArchiveViewerMessages) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const requestIdRef = useRef(0)
  const previewRequestIdRef = useRef(0)
  const archiveHandleRef = useRef<ArchiveHandle | null>(null)
  const archiveControllerRef = useRef<AbortController | null>(null)
  const previewRef = useRef<PreviewState>({ status: "idle" })
  const textDownloadUrlRef = useRef<string | null>(null)

  const [archiveFile, setArchiveFile] = useState<File | null>(null)
  const [archiveHandle, setArchiveHandle] = useState<ArchiveHandle | null>(null)
  const [currentDirectory, setCurrentDirectory] = useState("")
  const [search, setSearch] = useState("")
  const [selectedPath, setSelectedPath] = useState("")
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" })
  const [textDownloadUrl, setTextDownloadUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const entries = archiveHandle?.entries ?? EMPTY_ENTRIES
  const rowIndex = useMemo(() => buildRowIndex(entries), [entries])
  const visibleRows = useMemo(() => {
    const rows = getRowsForDirectory(rowIndex, currentDirectory)
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((row) => row.name.toLowerCase().includes(query))
  }, [currentDirectory, rowIndex, search])
  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.path === selectedPath) ?? null,
    [entries, selectedPath]
  )
  const summary = useMemo(() => summarizeEntries(entries), [entries])

  useEffect(() => {
    previewRef.current = preview
  }, [preview])

  useEffect(() => {
    return () => {
      requestIdRef.current += 1
      archiveControllerRef.current?.abort()
      void archiveHandleRef.current?.dispose()
      cleanupPreview(previewRef.current)
      if (textDownloadUrlRef.current) {
        URL.revokeObjectURL(textDownloadUrlRef.current)
      }
    }
  }, [])

  async function handleFile(file: File | null) {
    if (!file) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    previewRequestIdRef.current += 1
    cleanupTextDownloadUrl()
    cleanupPreview(previewRef.current)
    const previousHandle = archiveHandleRef.current
    archiveHandleRef.current = null
    archiveControllerRef.current?.abort()
    const controller = new AbortController()
    archiveControllerRef.current = controller
    resetArchiveFor(file)
    setIsParsing(true)

    try {
      await previousHandle?.dispose()
      const nextHandle = await openArchive(file, controller.signal)
      if (requestIdRef.current !== requestId) {
        await nextHandle.dispose()
        return
      }

      archiveHandleRef.current = nextHandle
      setArchiveHandle(nextHandle)
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setErrorMessage(resolveArchiveError(error, messages))
      }
    } finally {
      if (requestIdRef.current === requestId) setIsParsing(false)
    }
  }

  async function loadPreview(
    handle: ArchiveHandle,
    entry: ArchiveEntry,
    requestId = requestIdRef.current
  ) {
    const previewRequestId = previewRequestIdRef.current + 1
    previewRequestIdRef.current = previewRequestId
    const isStalePreview = () =>
      requestIdRef.current !== requestId ||
      previewRequestIdRef.current !== previewRequestId
    cleanupTextDownloadUrl()
    cleanupPreview(previewRef.current)
    setPreview({ status: "loading" })

    try {
      const nextPreview = await loadEntryPreview(handle, entry, messages)
      if (isStalePreview()) {
        cleanupLoadedPreview(nextPreview)
        return
      }

      setManagedTextDownloadUrl(nextPreview.textDownloadUrl)
      setPreview(nextPreview.preview)
    } catch (error) {
      if (isStalePreview()) return
      setPreview({
        status: "unavailable",
        message: resolveArchiveError(error, messages),
        blob: null,
      })
    }
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    void handleFile(file)
  }

  function handleDragEnter(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  function handleDragLeave(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)
    void handleFile(event.dataTransfer.files[0] ?? null)
  }

  function handleDirectoryChange(path: string) {
    const nextDirectory = normalizeDirectoryPath(path)

    startTransition(() => {
      setCurrentDirectory(nextDirectory)
      setSearch("")
    })

    resetPreviewSelection()
  }

  function handleFileSelect(path: string) {
    const entry = entries.find((item) => item.path === path)
    if (!entry || !archiveHandle || entry.kind !== "file") return

    setSelectedPath(path)
    setIsPreviewOpen(true)
    void loadPreview(archiveHandle, entry)
  }

  function handlePreviewOpenChange(open: boolean) {
    if (open) {
      setIsPreviewOpen(true)
      return
    }

    resetPreviewSelection()
  }

  async function handleEntryDownload(path: string) {
    const handle = archiveHandleRef.current
    const entry = entries.find((item) => item.path === path)
    if (!handle || !entry || entry.kind !== "file") return

    try {
      await downloadArchiveEntry(handle, entry)
    } catch (error) {
      if (archiveHandleRef.current === handle) {
        setErrorMessage(resolveArchiveError(error, messages))
      }
    }
  }

  async function clearArchive() {
    requestIdRef.current += 1
    previewRequestIdRef.current += 1
    cleanupTextDownloadUrl()
    cleanupPreview(previewRef.current)
    const handle = archiveHandleRef.current
    archiveHandleRef.current = null
    archiveControllerRef.current?.abort()
    archiveControllerRef.current = null
    resetArchiveFor(null)
    setIsParsing(false)
    await handle?.dispose()
  }

  function resetArchiveFor(file: File | null) {
    setArchiveFile(file)
    setArchiveHandle(null)
    setCurrentDirectory("")
    setSearch("")
    setSelectedPath("")
    setPreview({ status: "idle" })
    setIsPreviewOpen(false)
    setErrorMessage("")
  }

  function resetPreviewSelection() {
    previewRequestIdRef.current += 1
    cleanupTextDownloadUrl()
    cleanupPreview(previewRef.current)
    setSelectedPath("")
    setPreview({ status: "idle" })
    setIsPreviewOpen(false)
  }

  function cleanupTextDownloadUrl() {
    if (textDownloadUrlRef.current) {
      URL.revokeObjectURL(textDownloadUrlRef.current)
    }
    textDownloadUrlRef.current = null
    setTextDownloadUrl(null)
  }

  function setManagedTextDownloadUrl(url: string | null) {
    cleanupTextDownloadUrl()
    textDownloadUrlRef.current = url
    setTextDownloadUrl(url)
  }

  return {
    accept: acceptedArchiveTypes,
    archiveFile,
    archiveHandle,
    archiveSize: archiveFile ? formatBytes(archiveFile.size) : null,
    currentDirectory,
    errorMessage,
    fileInputRef,
    handleDirectoryChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleEntryDownload,
    handleFileSelect,
    handlePreviewOpenChange,
    handleInputChange: onInputChange,
    isPreviewOpen,
    isDragging,
    isParsing,
    preview,
    search,
    selectedEntry,
    selectedPath,
    setSearch,
    summary,
    textDownloadUrl,
    visibleRows,
    clearArchive,
    pickFile: () => fileInputRef.current?.click(),
  }
}

function handleDragOver(event: DragEvent<HTMLButtonElement>) {
  event.preventDefault()
}

export { useArchiveViewer }
