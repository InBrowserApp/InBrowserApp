import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Folder, Maximize2, Minimize2, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

type Messages = Record<
  | "open"
  | "replace"
  | "clear"
  | "limits"
  | "reader"
  | "privacy"
  | "focus"
  | "exitFocus"
  | "releaseFile",
  string
>

export function DocumentWorkspace({
  tool,
  file,
  onFile,
  accept,
  active,
  messages: m,
  children,
}: {
  tool: string
  file: File | null
  onFile: (file: File | null) => void
  accept: string
  active: boolean
  messages: Messages
  children: ReactNode
}) {
  const frame = useRef<HTMLDialogElement>(null)
  const picker = useRef<HTMLInputElement>(null)
  const focusButton = useRef<HTMLButtonElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [focused, setFocused] = useState(false)
  const [height, setHeight] = useState(600)
  function exitFocus() {
    const dialog = frame.current!
    dialog.close()
    dialog.show()
    setFocused(false)
    const target =
      focusButton.current ??
      dialog.querySelector<HTMLButtonElement>("[data-file-open]")
    target?.focus({ preventScroll: true })
  }
  function enterFocus() {
    const dialog = frame.current!
    dialog.close()
    dialog.showModal()
    setFocused(true)
    focusButton.current?.focus({ preventScroll: true })
  }
  useEffect(() => {
    if (!active && focused) exitFocus()
  }, [active, focused])
  useEffect(() => {
    if (!focused) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [focused])
  useEffect(() => {
    function resize() {
      const top = frame.current!.getBoundingClientRect().top + window.scrollY
      setHeight(Math.max(400, window.innerHeight - top - 24))
    }
    if (focused) return
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame.current!.parentElement!)
    window.addEventListener("resize", resize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resize)
    }
  }, [focused, active])
  const unit =
    file && file.size >= 1024 * 1024
      ? "megabyte"
      : file && file.size >= 1024
        ? "kilobyte"
        : "byte"
  const divisor =
    unit === "megabyte" ? 1024 * 1024 : unit === "kilobyte" ? 1024 : 1
  const size = file
    ? new Intl.NumberFormat(undefined, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: 1,
      }).format(file.size / divisor)
    : ""
  return (
    <section
      data-tool={tool}
      className="min-w-0"
      onDragEnter={(event) => {
        if (event.dataTransfer.types?.includes("Files")) {
          event.preventDefault()
          dragDepth.current++
          setDragging(true)
        }
      }}
      onDragLeave={() => {
        if (--dragDepth.current <= 0) {
          dragDepth.current = 0
          setDragging(false)
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        dragDepth.current = 0
        setDragging(false)
        const next = event.dataTransfer.files[0]
        if (next) onFile(next)
      }}
    >
      <dialog
        ref={frame}
        open
        aria-modal={focused || undefined}
        aria-label={m.reader}
        data-document-workspace
        data-focus={focused || undefined}
        onCancel={(event) => {
          event.preventDefault()
          exitFocus()
        }}
        style={{ height: focused ? "100dvh" : active ? height : undefined }}
        className={cn(
          "m-0 flex w-full max-w-none min-w-0 flex-col overflow-hidden bg-background p-0 text-foreground",
          focused
            ? "fixed inset-0 max-h-none border-0"
            : "relative rounded-xl border"
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
          {file ? (
            <DocumentIconButton
              label={m.replace}
              onClick={() => picker.current?.click()}
            >
              <Folder aria-hidden="true" />
            </DocumentIconButton>
          ) : (
            <Button data-file-open onClick={() => picker.current?.click()}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
          )}
          <span
            dir="auto"
            className="min-w-0 flex-1 truncate text-sm"
            title={file ? `${file.name}\n${m.privacy}` : undefined}
          >
            {file ? file.name : m.limits}
            {file ? (
              <span className="ms-2 text-xs text-muted-foreground">{size}</span>
            ) : null}
          </span>
          {active ? (
            <DocumentIconButton
              ref={focusButton}
              label={focused ? m.exitFocus : m.focus}
              aria-pressed={focused}
              onClick={focused ? exitFocus : enterFocus}
            >
              {focused ? (
                <Minimize2 aria-hidden="true" />
              ) : (
                <Maximize2 aria-hidden="true" />
              )}
            </DocumentIconButton>
          ) : null}
          {file ? (
            <DocumentIconButton label={m.clear} onClick={() => onFile(null)}>
              <X aria-hidden="true" />
            </DocumentIconButton>
          ) : null}
          <input
            ref={picker}
            type="file"
            accept={accept}
            className="sr-only"
            tabIndex={-1}
            aria-label={m.open}
            onChange={(event) => {
              const next = event.target.files?.[0]
              if (next) onFile(next)
              event.target.value = ""
            }}
          />
        </div>
        {children}
        {dragging ? (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 flex items-center justify-center border-2 border-dashed border-primary bg-background/95 p-6 text-center"
          >
            {m.releaseFile}
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
