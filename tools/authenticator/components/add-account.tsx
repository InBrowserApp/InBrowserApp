import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Camera,
  FolderInput,
  ImageUp,
  MonitorDown,
  ScanLine,
} from "@workspace/ui/icons"

import { readBackup } from "../backups"
import { parseImportLink } from "../import"
import { AccountForm } from "./account-form"
import { requestCapture, ScanDialog } from "./scan-dialog"
import type { Setup } from "../accounts"
import type { Messages } from "../types"
import type { Capture } from "./scan-dialog"

function AddAccount({
  messages,
  onAdd,
}: {
  messages: Messages
  onAdd: (setups: Setup[]) => string | undefined
}) {
  const [media, setMedia] = useState<MediaDevices | undefined>()
  const imageInput = useRef<HTMLInputElement>(null)
  const backupInput = useRef<HTMLInputElement>(null)
  const captureTrigger = useRef<HTMLButtonElement>(null)
  const fileImport = useRef<AbortController>(null)
  const [capture, setCapture] = useState<Capture | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMedia(navigator.mediaDevices)
    return () => fileImport.current?.abort()
  }, [])

  useEffect(() => () => capture?.stop(), [capture])

  function finishCapture(setups?: Setup[]) {
    setCapture(null)
    setError(setups ? (onAdd(setups) ?? "") : messages.scanError)
  }

  function startCapture(
    source: Capture["source"],
    trigger: HTMLButtonElement,
    devices: MediaDevices
  ) {
    setError("")
    captureTrigger.current = trigger
    setCapture(requestCapture(source, devices))
  }

  async function importFile(
    event: ChangeEvent<HTMLInputElement>,
    kind: "qr" | "backup"
  ) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const controller = new AbortController()
    fileImport.current = controller
    setBusy(true)
    setError("")
    let setups: Setup[] | undefined
    try {
      if (kind === "backup") {
        setups = readBackup(await file.text())
      } else {
        const { default: QrScanner } = await import("qr-scanner")
        const { data } = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        })
        setups = await parseImportLink(data)
      }
    } catch {
      // The message below matches the chosen input and leaves it ready to retry.
    }
    if (controller.signal.aborted) return
    setBusy(false)
    const invalid = kind === "qr" ? messages.invalidQr : messages.invalidBackup
    setError(setups ? (onAdd(setups) ?? "") : invalid)
  }

  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <section className="p-5 sm:p-7">
        <h2 className="mb-5 font-heading text-lg font-semibold">
          {messages.add}
        </h2>
        <AccountForm messages={messages} onSave={onAdd} />
      </section>
      <section className="border-t bg-muted/35 p-5 sm:p-7 md:border-s md:border-t-0">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <ScanLine className="size-5" aria-hidden="true" />
          {messages.qrTitle}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {messages.qrHint}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            disabled={busy}
            onClick={() => imageInput.current?.click()}
          >
            <ImageUp data-icon="inline-start" aria-hidden="true" />
            {messages.chooseImage}
          </Button>
          {media?.getUserMedia && (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={busy}
              onClick={(event) =>
                startCapture("camera", event.currentTarget, media)
              }
            >
              <Camera data-icon="inline-start" aria-hidden="true" />
              {messages.camera}
            </Button>
          )}
          {media?.getDisplayMedia && (
            <Button
              type="button"
              variant="ghost"
              className="h-10"
              disabled={busy}
              onClick={(event) =>
                startCapture("screen", event.currentTarget, media)
              }
            >
              <MonitorDown data-icon="inline-start" aria-hidden="true" />
              {messages.screen}
            </Button>
          )}
        </div>
        <div className="mt-5 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            className="h-10"
            disabled={busy}
            onClick={() => backupInput.current?.click()}
          >
            <FolderInput data-icon="inline-start" aria-hidden="true" />
            {messages.restore}
          </Button>
        </div>
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          aria-label={messages.chooseImage}
          hidden
          onChange={(event) => void importFile(event, "qr")}
        />
        <input
          ref={backupInput}
          type="file"
          accept=".json,application/json"
          aria-label={messages.restore}
          hidden
          onChange={(event) => void importFile(event, "backup")}
        />
        {busy && (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            {messages.reading}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <ScanDialog
          capture={capture}
          messages={messages}
          onClose={() => setCapture(null)}
          onCloseAutoFocus={() => captureTrigger.current?.focus()}
          onFinish={finishCapture}
        />
      </section>
    </div>
  )
}

export { AddAccount }
