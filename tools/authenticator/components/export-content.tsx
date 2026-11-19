import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Download, ScanLine } from "@workspace/ui/icons"

import { createBackup } from "../backups"
import type { Setup } from "../accounts"
import type { Messages } from "../types"

function QrPreview({
  link,
  messages,
  filename,
  description,
}: {
  link: string
  messages: Messages
  filename: string
  description: string
}) {
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function renderQr() {
      try {
        const { toDataURL } = await import("qrcode")
        const qr = await toDataURL(link, {
          width: 512,
          margin: 4,
          errorCorrectionLevel: "L",
        })
        if (active) setResult(qr)
      } catch {
        if (active) setResult("")
      }
    }

    void renderQr()
    return () => {
      active = false
    }
  }, [link])

  if (result === "")
    return (
      <p role="alert" className="text-sm text-destructive">
        {messages.qrError}
      </p>
    )
  if (!result) return null
  return (
    <div className="grid justify-items-center gap-3">
      <img
        src={result}
        alt={description}
        width={256}
        height={256}
        className="max-w-full rounded-md"
      />
      <Button variant="outline" asChild>
        <a href={result} download={filename}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {messages.downloadQr}
        </a>
      </Button>
    </div>
  )
}

function ExportContent({
  accounts,
  messages,
}: {
  accounts: readonly Setup[]
  messages: Messages
}) {
  const [links, setLinks] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  function downloadBackup() {
    const file = new Blob([createBackup(accounts)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = "inbrowser-authenticator-backup.json"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function showGoogleQr() {
    setBusy(true)
    setError("")
    try {
      const { canExportMigration, createMigrationLinks } =
        await import("../migration")
      if (canExportMigration(accounts)) {
        setLinks(createMigrationLinks(accounts))
      } else {
        setError(messages.googleSettings)
      }
    } catch {
      setError(messages.qrError)
    } finally {
      setBusy(false)
    }
  }

  const link = links[index]
  const pageLabel = messages.qrPage
    .replace("{page}", String(index + 1))
    .replace("{total}", String(links.length))

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadBackup}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {messages.downloadBackup}
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-expanded={links.length > 0}
          aria-disabled={busy}
          onClick={() => {
            if (links.length) {
              setLinks([])
              setIndex(0)
            } else if (!busy) {
              void showGoogleQr()
            }
          }}
        >
          <ScanLine data-icon="inline-start" aria-hidden="true" />
          {messages.exportGoogle}
        </Button>
      </div>
      {error && (
        <p role="status" className="text-sm text-muted-foreground">
          {error}
        </p>
      )}
      {link && (
        <>
          <QrPreview
            key={link}
            link={link}
            messages={messages}
            filename={`authenticator-export-${index + 1}.png`}
            description={messages.exportGoogle}
          />
          {links.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              >
                {messages.previous}
              </Button>
              <span
                aria-live="polite"
                className="text-sm text-muted-foreground"
              >
                {pageLabel}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={index === links.length - 1}
                onClick={() => setIndex(index + 1)}
              >
                {messages.next}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}

export { ExportContent, QrPreview }
