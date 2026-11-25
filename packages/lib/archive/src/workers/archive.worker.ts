import { ArchiveError } from "../core/types"
import createLibarchive from "../vendor/libarchive.mjs"
import wasmUrl from "../vendor/libarchive.wasm?url"
import { LibarchiveReader } from "./libarchive-reader"

import type { ArchiveRequest, ArchiveResponse } from "./protocol"

declare const self: DedicatedWorkerGlobalScope

let reader: LibarchiveReader

self.onmessage = async ({ data }: MessageEvent<ArchiveRequest>) => {
  try {
    if (data.type === "open") {
      const module = await createLibarchive({ locateFile: () => wasmUrl })
      const { file, format } = data
      const fileReader = new FileReaderSync()
      reader = new LibarchiveReader(
        module,
        {
          name: file.name,
          size: file.size,
          read: (offset, length) =>
            new Uint8Array(
              fileReader.readAsArrayBuffer(file.slice(offset, offset + length))
            ),
        },
        format
      )
      postResponse({
        id: data.id,
        type: "opened",
        listing: reader.list(data.preservePaths),
      })
    } else {
      const blob = reader.extract(data.index, data.path, data.keepOpen)
      postResponse({ id: data.id, type: "extracted", blob })
    }
  } catch (error) {
    postResponse({
      id: data.id,
      type: "error",
      code: error instanceof ArchiveError ? error.code : "archive-read-failed",
      message:
        error instanceof Error ? error.message : "Could not read archive.",
    })
  }
}

function postResponse(response: ArchiveResponse) {
  self.postMessage(response)
}
