import { useCallback, useEffect, useRef, useState } from "react"
import type { Torrent, TorrentFile } from "webtorrent"
import { InvalidTorrentError, openTorrent } from "./open-torrent"
import { NoFileDataError, saveTorrentFile } from "./save-file"

type Session =
  | { status: "idle" | "opening" }
  | { status: "ready"; torrent: Torrent }
type Notice =
  | "invalid"
  | "unreachable"
  | "failed"
  | "noData"
  | "saved"
  | "written"

function useDownloader() {
  const sessionRequest = useRef<AbortController>(null)
  const activeDownload = useRef<AbortController>(null)
  const [session, setSession] = useState<Session>({ status: "idle" })
  const [download, setDownload] = useState<{
    file: TorrentFile
    percent: number
  }>()
  const [notice, setNotice] = useState<Notice>()

  const close = useCallback(() => {
    sessionRequest.current?.abort()
    sessionRequest.current = null
    activeDownload.current = null
    setSession({ status: "idle" })
    setDownload(undefined)
    setNotice(undefined)
  }, [])

  useEffect(() => {
    window.addEventListener("pagehide", close)
    return () => {
      window.removeEventListener("pagehide", close)
      sessionRequest.current?.abort()
    }
  }, [close])

  async function open(input: string | File) {
    close()
    const request = new AbortController()
    sessionRequest.current = request
    setSession({ status: "opening" })

    const timeout = window.setTimeout(() => {
      if (!request.signal.aborted) {
        close()
        setNotice("unreachable")
      }
    }, 25_000)

    try {
      const torrent = await openTorrent(input, request.signal, () => {
        close()
        setNotice("unreachable")
      })
      if (!request.signal.aborted) setSession({ status: "ready", torrent })
    } catch (error) {
      if (!request.signal.aborted) {
        close()
        setNotice(
          error instanceof InvalidTorrentError ? "invalid" : "unreachable"
        )
      }
    } finally {
      window.clearTimeout(timeout)
    }
  }

  async function save(file: TorrentFile) {
    const request = sessionRequest.current
    if (
      !request ||
      request.signal.aborted ||
      activeDownload.current ||
      session.status !== "ready"
    )
      return
    const { torrent } = session
    const transfer = new AbortController()
    activeDownload.current = transfer
    const signal = AbortSignal.any([transfer.signal, request.signal])
    setNotice(undefined)
    setDownload({ file, percent: 0 })

    try {
      const result = await saveTorrentFile(
        file,
        signal,
        (percent) => setDownload({ file, percent }),
        () => torrent.downloaded
      )
      if (!signal.aborted) setNotice(result)
    } catch (error) {
      if (
        !signal.aborted &&
        !(error instanceof DOMException && error.name === "AbortError")
      ) {
        setNotice(error instanceof NoFileDataError ? "noData" : "failed")
      }
    } finally {
      if (activeDownload.current === transfer) {
        activeDownload.current = null
        setDownload(undefined)
      }
    }
  }

  return {
    session,
    download,
    notice,
    open,
    close,
    save,
    cancel: () => activeDownload.current?.abort(),
  }
}

export { useDownloader }
