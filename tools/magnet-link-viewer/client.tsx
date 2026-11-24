import { PublicTrackerOption } from "@workspace/ui/components/tool/public-tracker-option"
import { useEffect, useId, useRef, useState } from "react"
import { TorrentDetails } from "@workspace/ui/components/tool/torrent-details"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Magnet, TriangleAlert } from "@workspace/ui/icons"
import { lookupMetadata, readMagnet } from "./lookup"
import type {
  TorrentMessages,
  TorrentMetadata,
} from "@workspace/ui/components/tool/torrent-details"
import type EnglishMessages from "./messages/en.json"

const EXAMPLE =
  "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
const TIMEOUT_MS = 25_000

type Result = Awaited<ReturnType<typeof readMagnet>> & {
  metadata?: TorrentMetadata
}

function MagnetLinkViewer({
  language,
  messages: m,
  shared,
}: {
  language: string
  messages: typeof EnglishMessages
  shared: TorrentMessages
}) {
  const inputId = useId()
  const current = useRef<AbortController>(null)
  const [input, setInput] = useState("")
  const [publicTrackers, setPublicTrackers] = useState(true)
  const [result, setResult] = useState<Result>()
  const [error, setError] = useState<"invalid" | "unavailable" | "timeout">()
  const [loading, setLoading] = useState(false)

  useEffect(() => () => current.current?.abort(), [])

  function cancel() {
    current.current?.abort()
    setLoading(false)
  }

  async function inspect(value: string) {
    current.current?.abort()
    const request = new AbortController()
    current.current = request
    setResult(undefined)
    setError(undefined)
    setLoading(true)

    const timeout = window.setTimeout(() => {
      if (request.signal.aborted) return
      request.abort()
      setError("timeout")
      setLoading(false)
    }, TIMEOUT_MS)

    let link: Awaited<ReturnType<typeof readMagnet>> | undefined
    try {
      link = await readMagnet(value)
      if (request.signal.aborted) return
      setResult(link)
      const metadata = await lookupMetadata(
        link,
        request.signal,
        publicTrackers
      )
      if (!request.signal.aborted) setResult({ ...link, metadata })
    } catch {
      if (!request.signal.aborted) setError(link ? "unavailable" : "invalid")
    } finally {
      window.clearTimeout(timeout)
      if (current.current === request) setLoading(false)
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Card>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (input.trim()) void inspect(input)
            }}
          >
            <label htmlFor={inputId} className="text-sm font-medium">
              {m.input}
            </label>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Input
                id={inputId}
                dir="ltr"
                className="h-9 font-mono"
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                aria-invalid={error === "invalid"}
                aria-describedby={`${inputId}-hint`}
                placeholder="magnet:?xt=urn:btih:…"
                value={input}
                onChange={(event) => {
                  cancel()
                  setError(undefined)
                  setResult(undefined)
                  setInput(event.target.value)
                }}
              />
              <Button
                type="submit"
                size="lg"
                disabled={!input.trim() || loading}
              >
                <Magnet data-icon="inline-start" aria-hidden="true" />
                {m.inspect}
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p
                id={`${inputId}-hint`}
                className="text-sm text-muted-foreground"
              >
                {m.network}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => {
                  setInput(EXAMPLE)
                  void inspect(EXAMPLE)
                }}
              >
                {m.example}
              </Button>
            </div>
            <PublicTrackerOption
              checked={publicTrackers}
              onChange={setPublicTrackers}
              disabled={loading}
              messages={shared}
            />
          </form>
        </CardContent>
      </Card>
      {loading ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
          <p role="status" className="flex items-center gap-2 text-sm">
            <Spinner aria-hidden="true" />
            {m.loading}
          </p>
          <Button type="button" size="sm" variant="outline" onClick={cancel}>
            {m.cancel}
          </Button>
        </div>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      ) : null}
      {result ? (
        <TorrentDetails
          torrent={result.metadata ?? result.identity}
          magnet={result.magnet}
          language={language}
          messages={shared}
          heading={result.metadata ? shared.details : m.linkDetails}
        />
      ) : null}
    </div>
  )
}

export default MagnetLinkViewer
