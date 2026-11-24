import { useEffect, useId, useRef, useState, type ChangeEvent } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { BookOpen, Download, FolderInput, Upload } from "@workspace/ui/icons"
import { prepareCover } from "./cover"
import { CoverField, DetailsFields } from "./editor-fields"
import type { BookDetails, EpubBook, Messages } from "./types"

function pickedFile(
  event: ChangeEvent<HTMLInputElement>,
  handleFile: (file: File) => Promise<void>
) {
  const picker = event.currentTarget
  const file = picker.files?.[0]
  picker.value = ""
  if (file) void handleFile(file)
}

export default function EpubMetadataEditor({
  messages: m,
}: {
  messages: Messages
}) {
  const dropId = useId()
  const epubInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const currentFile = useRef<HTMLDivElement>(null)
  const [book, setBook] = useState<(EpubBook & { file: File }) | null>(null)
  const [replacement, setReplacement] = useState<Blob | null>(null)
  const [busy, setBusy] = useState<"open" | "cover" | "save" | null>(null)
  const [dragging, setDragging] = useState(false)
  const [openError, setOpenError] = useState<"invalidEpub" | "protectedEpub">()
  const [coverError, setCoverError] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"downloadReady" | "saveError">()
  const file = book?.file
  const opening = busy === "open"
  const saving = busy === "save"

  function openPicker() {
    if (!busy) epubInput.current?.click()
  }

  useEffect(() => {
    if (file) currentFile.current?.focus({ preventScroll: true })
  }, [file])

  async function open(next: File) {
    if (busy) return
    setBusy("open")
    setOpenError(undefined)
    try {
      const { openEpub } = await import("./epub")
      const source = await openEpub(next)
      setBook({ ...source, file: next })
      setReplacement(null)
      setCoverError(false)
      setSaveStatus(undefined)
    } catch (error) {
      setOpenError(
        error instanceof Error && error.message === "protected"
          ? "protectedEpub"
          : "invalidEpub"
      )
    } finally {
      setBusy(null)
    }
  }

  async function chooseCover(next: File) {
    if (!book || busy) return
    setBusy("cover")
    setCoverError(false)
    try {
      setReplacement(await prepareCover(next, book.coverType))
      setSaveStatus(undefined)
    } catch {
      setCoverError(true)
    } finally {
      setBusy(null)
    }
  }

  function edit(field: keyof BookDetails, value: string) {
    setBook(
      (current) =>
        current && {
          ...current,
          details: { ...current.details, [field]: value },
        }
    )
    setSaveStatus(undefined)
  }

  async function download() {
    if (!book || busy) return
    setBusy("save")
    setSaveStatus(undefined)
    try {
      const { saveEpub } = await import("./epub")
      const blob = await saveEpub(book.file, book.details, replacement)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = book.file.name.replace(/\.epub$/i, "") + "-edited.epub"
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
      setSaveStatus("downloadReady")
    } catch {
      setSaveStatus("saveError")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div data-tool="epub-metadata-editor" className="grid min-w-0 gap-3">
      <input
        ref={epubInput}
        type="file"
        accept=".epub,application/epub+zip"
        aria-label={m.chooseEpub}
        hidden
        onChange={(event) => pickedFile(event, open)}
      />
      {openError && (
        <p role="alert" className="text-sm text-destructive">
          {m[openError]}
        </p>
      )}
      {book ? (
        <form
          className="min-w-0 rounded-xl border bg-card"
          onSubmit={(event) => {
            event.preventDefault()
            void download()
          }}
        >
          <div
            ref={currentFile}
            tabIndex={-1}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 outline-none sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
              <BookOpen
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <bdi className="wrap-anywhere">{book.file.name}</bdi>
            </div>
            <Button
              variant="ghost"
              type="button"
              className="h-auto min-h-9 max-w-full text-start whitespace-normal aria-disabled:cursor-wait aria-disabled:opacity-50"
              aria-disabled={busy !== null}
              onClick={openPicker}
            >
              {opening ? (
                <Spinner aria-hidden="true" />
              ) : (
                <FolderInput aria-hidden="true" />
              )}
              {opening ? m.opening : m.openAnother}
            </Button>
          </div>
          <fieldset
            disabled={busy !== null}
            className="grid min-w-0 items-start gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]"
          >
            <input
              ref={coverInput}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              aria-label={m.chooseCover}
              hidden
              onChange={(event) => pickedFile(event, chooseCover)}
            />
            <CoverField
              cover={book.cover}
              replacement={replacement}
              loading={busy === "cover"}
              error={coverError}
              messages={m}
              onPick={() => coverInput.current?.click()}
              onRestore={() => {
                setReplacement(null)
                setCoverError(false)
                setSaveStatus(undefined)
              }}
            />
            <DetailsFields
              details={book.details}
              messages={m}
              onChange={edit}
            />
          </fieldset>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t px-4 py-3 sm:justify-end sm:px-5">
            {saveStatus && (
              <p
                role={saveStatus === "saveError" ? "alert" : "status"}
                className={
                  saveStatus === "saveError"
                    ? "text-sm text-destructive"
                    : "text-sm text-muted-foreground"
                }
              >
                {m[saveStatus]}
              </p>
            )}
            <Button
              type="submit"
              disabled={busy !== null}
              className="h-auto min-h-10 w-full whitespace-normal sm:w-auto"
            >
              {saving ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              {saving ? m.saving : m.download}
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          aria-labelledby={dropId}
          aria-describedby={dropId + "-instructions"}
          aria-disabled={opening}
          className="grid min-h-52 cursor-pointer place-items-center rounded-xl border border-dashed bg-card p-5 text-center transition-colors outline-none hover:border-ring hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:cursor-wait data-[dragging=true]:border-ring data-[dragging=true]:bg-muted"
          data-dragging={dragging}
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault()
            if (!opening) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const next = event.dataTransfer.files[0]
            if (next) void open(next)
          }}
        >
          <span className="pointer-events-none grid justify-items-center gap-2">
            <span className="mb-1 grid size-11 place-items-center rounded-lg bg-muted text-muted-foreground">
              {opening ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Upload className="size-5" aria-hidden="true" />
              )}
            </span>
            <span id={dropId} className="font-semibold" aria-live="polite">
              {opening ? m.opening : m.chooseEpub}
            </span>
            <span id={dropId + "-instructions"} className="grid gap-2">
              <span className="text-sm text-muted-foreground">
                {m.dropEpub}
              </span>
              <span className="text-xs text-muted-foreground">
                {m.localFiles}
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
