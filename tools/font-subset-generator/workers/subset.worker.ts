import wasmUrl from "hb-subset-wasm/hb-subset.wasm?url"
import { generateSubset } from "./engine"
import type { SubsetOutput, SubsetRequest } from "../types"

export type WorkerResponse =
  | { ok: true; result: SubsetOutput }
  | { ok: false; error: string }

const scope = self as unknown as {
  onmessage: (event: MessageEvent<SubsetRequest>) => Promise<void>
  postMessage: (message: WorkerResponse, transfer?: Transferable[]) => void
}

scope.onmessage = async ({ data }) => {
  try {
    const response = await fetch(wasmUrl)
    if (!response.ok) throw new Error("WORKER_ERROR")
    const result = await generateSubset(data, await response.arrayBuffer())
    scope.postMessage({ ok: true, result }, [result.output])
  } catch (error) {
    scope.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : "GENERATION_ERROR",
    })
  }
}
