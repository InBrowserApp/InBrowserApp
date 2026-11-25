import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ViewportFocusButton } from "@workspace/ui/components/tool/viewport-focus"
import { Folder, X } from "@workspace/ui/icons"
import { useWorkspaceFocus } from "@workspace/ui/lib/use-workspace-focus"
import { cn } from "@workspace/ui/lib/utils"

type Messages = Record<
  | "open"
  | "replace"
  | "clear"
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
  fitContent = false,
  messages: m,
  children,
  renderEmpty,
}: {
  tool: string
  file: File | null
  onFile: (file: File | null) => void
  accept: string
  active: boolean
  fitContent?: boolean
  messages: Messages
  children: ReactNode
  renderEmpty?: (chooseFile: () => void) => ReactNode
}) {
  const focus = useWorkspaceFocus()
  const { frame, focusButton, focused, changeFocus } = focus
  const picker = useRef<HTMLInputElement>(null)
  const restoreOpenFocus = useRef(false)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [height, setHeight] = useState(600)
  const exitFocus = useCallback(() => {
    changeFocus(false)
    if (!focusButton.current) {
      frame.current
        ?.querySelector<HTMLButtonElement>("[data-file-open]")
        ?.focus({ preventScroll: true })
    }
  }, [changeFocus, focusButton, frame])
  useEffect(() => {
    if (!active && focused) exitFocus()
  }, [active, exitFocus, focused])
  useEffect(() => {
    if (file || !restoreOpenFocus.current) return
    restoreOpenFocus.current = false
    frame.current
      ?.querySelector<HTMLButtonElement>("[data-file-open]")
      ?.focus({ preventScroll: true })
  }, [file, frame])
  useEffect(() => {
    if (focused || fitContent) return
    const dialog = frame.current!
    function resize() {
      const top = dialog.getBoundingClientRect().top + window.scrollY
      setHeight(Math.max(400, window.innerHeight - top - 24))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(dialog.parentElement!)
    window.addEventListener("resize", resize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resize)
    }
  }, [focused, active, fitContent, frame])
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
  const chooseFile = () => picker.current?.click()
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
        style={{
          height: focused
            ? "100dvh"
            : active && !fitContent
              ? height
              : undefined,
        }}
        className={cn(
          "group/workspace m-0 flex w-full max-w-none min-w-0 flex-col overflow-hidden bg-background p-0 text-foreground",
          focused
            ? "fixed inset-0 max-h-none border-0"
            : "relative rounded-xl border"
        )}
      >
        {!file && renderEmpty ? (
          renderEmpty(chooseFile)
        ) : (
          <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
            {file ? (
              <DocumentIconButton label={m.replace} onClick={chooseFile}>
                <Folder aria-hidden="true" />
              </DocumentIconButton>
            ) : (
              <Button data-file-open onClick={chooseFile}>
                <Folder data-icon="inline-start" aria-hidden="true" />
                {m.open}
              </Button>
            )}
            {file ? (
              <span
                dir="auto"
                className="min-w-0 flex-1 truncate text-sm"
                title={`${file.name}\n${m.privacy}`}
              >
                {file.name}
                <span className="ms-2 text-xs text-muted-foreground">
                  {size}
                </span>
              </span>
            ) : null}
            {active ? <ViewportFocusButton focus={focus} messages={m} /> : null}
            {file ? (
              <DocumentIconButton
                label={m.clear}
                onClick={() => {
                  restoreOpenFocus.current = true
                  onFile(null)
                }}
              >
                <X aria-hidden="true" />
              </DocumentIconButton>
            ) : null}
          </div>
        )}
        <input
          ref={picker}
          type="file"
          accept={accept}
          hidden
          aria-label={m.open}
          onChange={(event) => {
            const next = event.target.files?.[0]
            if (next) onFile(next)
            event.target.value = ""
          }}
        />
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
