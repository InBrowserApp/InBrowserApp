import { useId, useRef, useState } from "react"
import { TorrentFiles } from "@workspace/ui/components/tool/torrent-files"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Check,
  Download,
  FileText,
  Magnet,
  TriangleAlert,
  X,
} from "@workspace/ui/icons"
import { useDownloader } from "./use-downloader"
import type EnglishMessages from "./messages/en.json"

const EXAMPLE =
  "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"

function TorrentDownloader({
  language,
  messages: m,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const [magnet, setMagnet] = useState("")
  const downloader = useDownloader()
  const { session, download, notice } = downloader
  const opening = session.status === "opening"
  const torrent = session.status === "ready" ? session.torrent : undefined
  const formatProgress = new Intl.NumberFormat(language, { style: "percent" })
  const isSuccess = notice === "saved" || notice === "written"

  return (
    <div className="grid min-w-0 gap-4">
      <Card>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (magnet.trim()) void downloader.open(magnet)
            }}
          >
            <label htmlFor={id} className="text-sm font-medium">
              {m.magnet}
            </label>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Input
                id={id}
                dir="ltr"
                className="h-9 font-mono"
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                aria-describedby={`${id}-hint`}
                placeholder="magnet:?xt=urn:btih:…"
                value={magnet}
                onChange={(event) => setMagnet(event.target.value)}
              />
              <Button
                size="lg"
                disabled={!magnet.trim() || opening}
                type="submit"
              >
                <Magnet aria-hidden="true" data-icon="inline-start" />
                {m.open}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInput}
                type="file"
                accept=".torrent,application/x-bittorrent"
                aria-label={m.choose}
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  event.currentTarget.value = ""
                  if (file) {
                    setMagnet("")
                    void downloader.open(file)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInput.current?.click()}
              >
                <FileText aria-hidden="true" data-icon="inline-start" />
                {m.choose}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={opening}
                onClick={() => {
                  setMagnet(EXAMPLE)
                  void downloader.open(EXAMPLE)
                }}
              >
                {m.example}
              </Button>
            </div>
            <p id={`${id}-hint`} className="text-sm text-muted-foreground">
              {m.network}
            </p>
          </form>
        </CardContent>
      </Card>
      {opening || torrent ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3">
          {torrent ? (
            <h2 className="min-w-0 font-heading text-lg font-semibold wrap-anywhere">
              <bdi>{torrent.name}</bdi>
            </h2>
          ) : (
            <p role="status" className="flex items-center gap-2 text-sm">
              <Spinner aria-hidden="true" />
              {m.opening}
            </p>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={downloader.close}
          >
            <X aria-hidden="true" data-icon="inline-start" />
            {m.stop}
          </Button>
        </div>
      ) : null}
      {download ? (
        <div className="grid min-w-0 gap-2 rounded-lg border bg-card px-4 py-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 text-sm wrap-anywhere">
              <bdi>{download.file.name}</bdi>
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={downloader.cancel}
            >
              {m.cancel}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <progress
              className="h-2 w-full accent-primary"
              max={100}
              value={download.percent}
              aria-label={m.downloading}
            />
            <span className="shrink-0 text-sm tabular-nums">
              <bdi>{formatProgress.format(download.percent / 100)}</bdi>
            </span>
          </div>
        </div>
      ) : null}
      {notice ? (
        <Alert
          variant={isSuccess ? "default" : "destructive"}
          role={isSuccess ? "status" : "alert"}
        >
          {isSuccess ? (
            <Check aria-hidden="true" />
          ) : (
            <TriangleAlert aria-hidden="true" />
          )}
          <AlertDescription>{m[notice]}</AlertDescription>
        </Alert>
      ) : null}
      {torrent ? (
        <TorrentFiles
          key={torrent.infoHash}
          files={torrent.files}
          messages={m}
          language={language}
          actions={{
            heading: m.action,
            render: (file) => (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={Boolean(download)}
                onClick={() => void downloader.save(file)}
              >
                <Download aria-hidden="true" data-icon="inline-start" />
                {m.download}
              </Button>
            ),
          }}
        />
      ) : null}
    </div>
  )
}

export default TorrentDownloader
