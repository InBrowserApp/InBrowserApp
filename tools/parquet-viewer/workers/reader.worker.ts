import { Session } from "../session"
import type { Request, Response } from "../types"

let session: Session
const reply = (message: Response) => self.postMessage(message)
self.onmessage = async ({ data }: MessageEvent<Request>) => {
  const { id } = data
  try {
    if (data.type === "open") {
      session = await Session.open(data.file)
      reply({ id, result: session.info })
    } else if (data.type === "page") {
      reply({ id, result: await session.page(data.start, data.end) })
    } else {
      const result = await session.export(
        data.start,
        data.end,
        data.format,
        (progress) => reply({ id, progress })
      )
      reply({ id, result })
    }
  } catch {
    reply({ id, error: true })
  }
}
