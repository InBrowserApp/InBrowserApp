import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { OFDDocument } from "@ofdjs/viewer"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { cn } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Toolbar } from "./toolbar"
import { Overview } from "./overview"
import { PageCanvas } from "./page-canvas"
import { diagnosticMessages } from "./diagnostics"
import { usePage } from "./use-page"
import type { Fit, Messages } from "./types"

export function Reader({
  document,
  messages: m,
}: {
  document: OFDDocument
  messages: Messages
}) {
  const [number, setNumber] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [overview, setOverview] = useState(false)
  const [fit, setFit] = useState<Fit>("width")
  const [manualZoom, setZoom] = useState(100)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [diagnostics, setDiagnostics] = useState(() =>
    diagnosticMessages(document.diagnostics, m)
  )
  const root = useRef<HTMLDivElement>(null)
  const id = useId()
  const overviewButton = useRef<HTMLButtonElement>(null)
  const focusPage = useRef(false)
  useEffect(() => {
    if (!overview && focusPage.current) {
      root.current?.focus({ preventScroll: true })
      focusPage.current = false
    }
  }, [overview])
  const result = usePage(document, number)
  const updateDiagnostics = useCallback(() => {
    setDiagnostics(diagnosticMessages(document.diagnostics, m))
  }, [document, m])
  useEffect(() => {
    const element = root.current!
    const resize = () => {
      if (element.clientWidth && element.clientHeight)
        setSize({ width: element.clientWidth, height: element.clientHeight })
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const viewport = result?.page?.getViewport({ rotation })
  const zoom =
    fit && viewport && size.width && size.height
      ? Math.max(
          1,
          Math.floor(
            100 *
              Math.min(
                (size.width - 32) / viewport.width,
                fit === "page" ? (size.height - 32) / viewport.height : Infinity
              )
          )
        )
      : manualZoom
  const onPage = (page: number) => {
    setNumber(page)
    root.current?.scrollTo(0, 0)
  }
  return (
    <>
      <Toolbar
        page={number}
        total={document.numPages}
        zoom={zoom}
        overview={overview}
        overviewId={id}
        overviewButton={overviewButton}
        onPage={onPage}
        onZoom={(value) => {
          setFit(null)
          setZoom(value)
        }}
        onFit={setFit}
        onRotate={() => setRotation((value) => (value + 90) % 360)}
        onOverview={() => setOverview((value) => !value)}
        messages={m}
      />
      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        {overview ? (
          <Overview
            id={id}
            document={document}
            current={number}
            onPage={(page) => {
              onPage(page)
              if (!window.matchMedia("(min-width: 640px)").matches) {
                focusPage.current = true
                setOverview(false)
              }
            }}
            onClose={() => {
              setOverview(false)
              overviewButton.current?.focus()
            }}
            onRendered={updateDiagnostics}
            messages={m}
          />
        ) : null}
        <div
          ref={root}
          className={cn(
            "min-h-0 min-w-0 flex-1 overflow-auto bg-muted p-4",
            overview && "hidden sm:block"
          )}
          role="region"
          aria-label={m.reader}
          // A scrollable reading region needs keyboard focus for arrow keys.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          dir="ltr"
        >
          {result?.error ? (
            <Alert variant="destructive">
              <AlertTitle>{m.pageError}</AlertTitle>
            </Alert>
          ) : result?.page ? (
            <div className="flex min-h-full w-max min-w-full items-start justify-center">
              <PageCanvas
                page={result.page}
                scale={zoom / 100}
                rotation={rotation}
                messages={m}
                onRendered={updateDiagnostics}
              />
            </div>
          ) : (
            <p
              role="status"
              className="flex items-center justify-center gap-2 p-6"
            >
              <Spinner />
              {m.rendering}
            </p>
          )}
        </div>
      </div>
      {diagnostics.length ? (
        <details
          className="max-h-36 shrink-0 overflow-auto border-t px-3 py-1"
          open={
            diagnostics.some((message) =>
              [
                m.signatureNotice,
                m.multiDocumentNotice,
                m.imageNotice,
              ].includes(message)
            ) || undefined
          }
        >
          <summary className="cursor-pointer rounded-sm py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">
            {m.compatibility} ({diagnostics.length})
          </summary>
          <Alert className="mb-1">
            <AlertDescription>
              <ul className="flex list-disc flex-col gap-1 ps-4">
                {diagnostics.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
              <p>{m.visualOnly}</p>
            </AlertDescription>
          </Alert>
        </details>
      ) : null}
      {!diagnostics.length ? (
        <p className="shrink-0 border-t px-3 py-2 text-xs text-muted-foreground">
          {m.visualOnly}
        </p>
      ) : null}
    </>
  )
}
