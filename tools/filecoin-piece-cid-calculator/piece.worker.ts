import { calculatePiece, type PieceCommitment } from "./core/commitment"

export type PieceWorkerReply =
  | { type: "progress"; percent: number }
  | { type: "result"; result: PieceCommitment }
  | { type: "error" }

function send(reply: PieceWorkerReply) {
  self.postMessage(reply)
}

self.onmessage = async ({ data }: MessageEvent<File>) => {
  try {
    let percent = 0
    const result = await calculatePiece(data, (bytesRead) => {
      const next = Math.floor((bytesRead / data.size) * 100)
      if (next > percent) {
        percent = next
        send({ type: "progress", percent })
      }
    })
    send({ type: "result", result })
  } catch {
    send({ type: "error" })
  }
}
