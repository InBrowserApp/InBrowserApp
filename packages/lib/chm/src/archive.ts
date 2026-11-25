import { ChmWorkerClient } from "@file-viewer/renderer-chm"
import {
  normalizeChmPath,
  resolveChmReference,
} from "@file-viewer/renderer-chm/security"

import moduleUrl from "@file-viewer/renderer-chm/wasm/chm_wasm.js?url&no-inline"
import wasmUrl from "@file-viewer/renderer-chm/wasm/chm_wasm_bg.wasm?url&no-inline"
import workerUrl from "@file-viewer/renderer-chm/worker/chm.worker.js?url&no-inline"

import { topicDirectory } from "./topics"

export async function openChm(file: File, signal: AbortSignal) {
  const buffer = await file.arrayBuffer()
  signal.throwIfAborted()
  const worker = new ChmWorkerClient({
    workerUrl,
    wasmModuleUrl: moduleUrl,
    wasmUrl,
  })
  try {
    const { manifest, entries } = await worker.open(buffer, signal)
    const paths = new Map(
      entries.map(({ path }) => [normalizeChmPath(path)?.toLowerCase(), path])
    )
    const lookup = (path: string) => paths.get(path.toLowerCase())
    const lookupTopic = (path: string) => {
      const entry = lookup(path)
      return entry && /\.(?:html?|xhtml|shtml)$/i.test(entry)
        ? entry
        : undefined
    }
    const resolve = (reference: string) => {
      const { path, fragment } = resolveChmReference("/", reference)
      const entry = path && lookupTopic(path)
      return entry ? { path: entry, fragment } : undefined
    }
    const { contents, topics, home } = topicDirectory(
      manifest,
      entries,
      resolve
    )
    if (!home) {
      worker.destroy()
      return null
    }

    return {
      contents,
      topics,
      home,
      encoding: manifest.encoding,
      lookup,
      read: (path: string, signal: AbortSignal) => worker.read(path, signal),
      lookupTopic,
      close: () => worker.destroy(),
    }
  } catch (error) {
    worker.destroy()
    throw error
  }
}

export {
  decodeChmText,
  sanitizeChmHtmlDocument,
} from "@file-viewer/renderer-chm/security"
export type { Destination, Topic } from "./topics"
