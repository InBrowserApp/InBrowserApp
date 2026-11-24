import { lintWithWasm } from "./actionlint"
import wasmUrl from "./vendor/actionlint.wasm?gzip-url"
import type { WorkflowCheck } from "./protocol"

function reportError(error: Error) {
  self.postMessage({ error: error.message } satisfies WorkflowCheck)
}

self.onmessage = async ({ data: source }: MessageEvent<string>) => {
  try {
    const response = await fetch(wasmUrl)
    if (!response.ok || !response.body)
      throw new Error("Could not load actionlint")
    const stream = response.body.pipeThrough(new DecompressionStream("gzip"))
    const binary = await new Response(stream).arrayBuffer()
    self.postMessage(await lintWithWasm(binary, source, reportError))
  } catch (error) {
    reportError(error as Error)
  }
}
