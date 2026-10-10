import { convert } from "./convert"
import type { Request, Result } from "./types"

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null
  postMessage: (result: Result) => void
}
scope.onmessage = async ({ data }) => scope.postMessage(await convert(data))
