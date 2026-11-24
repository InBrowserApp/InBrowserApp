import { downloadBlob } from "@workspace/ui/lib/download-blob"
import type { TorrentFile } from "webtorrent"

type FilePickerWindow = Window & {
  showSaveFilePicker?: (options: {
    suggestedName: string
  }) => Promise<FileSystemFileHandle>
}

class NoFileDataError extends Error {}

async function saveTorrentFile(
  file: Pick<TorrentFile, "name" | "length" | "downloaded" | "stream">,
  signal: AbortSignal,
  onProgress: (percent: number) => void
) {
  const handle = await (window as FilePickerWindow).showSaveFilePicker?.({
    suggestedName: file.name,
  })
  signal.throwIfAborted()
  const writable = await handle?.createWritable()
  const idle = new AbortController()
  const combined = AbortSignal.any([signal, idle.signal])
  let received = file.downloaded
  const timeout = (): number =>
    window.setTimeout(() => {
      if (file.downloaded > received) {
        received = file.downloaded
        timer = timeout()
      } else {
        idle.abort(new NoFileDataError())
      }
    }, 60_000)
  let timer = timeout()
  let written = 0
  let progress = 0

  try {
    const measured = new TransformStream<
      Uint8Array<ArrayBuffer>,
      Uint8Array<ArrayBuffer>
    >({
      transform(chunk, controller) {
        window.clearTimeout(timer)
        timer = timeout()
        written += chunk.byteLength
        const next = Math.floor((written / file.length) * 100)
        if (next !== progress) onProgress(next)
        progress = next
        controller.enqueue(chunk)
      },
      flush() {
        if (written !== file.length) throw new Error("Incomplete file")
      },
    })
    const stream = file.stream().pipeThrough(measured, { signal: combined })

    if (writable) {
      await stream.pipeTo(writable, { signal: combined })
      return "written"
    }

    const blob = await new Response(stream).blob()
    combined.throwIfAborted()
    downloadBlob(blob, file.name)
    return "saved"
  } catch (error) {
    await writable?.abort().catch(() => undefined)
    throw combined.aborted ? combined.reason : error
  } finally {
    window.clearTimeout(timer)
  }
}

export { NoFileDataError, saveTorrentFile }
