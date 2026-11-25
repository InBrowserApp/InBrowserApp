import { failure } from "@workspace/email"
import { openPst, pstSource } from "@workspace/email/pst"
import type { ArchiveReply, ArchiveRequest } from "@workspace/email/archive"

declare const FileReaderSync: new () => {
  readAsArrayBuffer(file: Blob): ArrayBuffer
}

let archive: Awaited<ReturnType<typeof openPst>>

self.onmessage = async ({ data }: MessageEvent<ArchiveRequest>) => {
  let reply: ArchiveReply
  if ("file" in data) {
    try {
      const reader = new FileReaderSync()
      archive = await openPst(
        pstSource(data.file, (part) => reader.readAsArrayBuffer(part))
      )
      reply = { messages: archive.messages, folders: archive.folders }
    } catch (error) {
      reply = { error: failure(error) }
    }
  } else {
    try {
      reply = { id: data.id, email: archive.read(data.id) }
    } catch (error) {
      reply = { id: data.id, error: failure(error) }
    }
  }
  self.postMessage(reply)
}
