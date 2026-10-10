import { readFileSync } from "node:fs"
import { afterEach, expect, test, vi } from "vitest"
import { unzipSync } from "fflate"
import type { Request, Response } from "./types"

afterEach(() => vi.unstubAllGlobals())
test("converts actual ODS archive in a worker and answers later window requests", async () => {
  vi.resetModules()
  const host = {
    onmessage: null as ((event: MessageEvent<Request>) => Promise<void>) | null,
    postMessage: vi.fn<(message: Response, transfer: Transferable[]) => void>(),
  }
  vi.stubGlobal("self", host)
  await import("./worker")
  const bytes = readFileSync("tools/ods-to-xlsx-converter/fixtures/typed.ods")
  await host.onmessage!({
    data: { type: "open", file: new File([bytes], "typed.ods") },
  } as MessageEvent<Request>)
  const [result, transfer] = host.postMessage.mock.calls[0]!
  expect(result.type).toBe("ready")
  if (result.type !== "ready") throw new Error("Expected converted workbook")
  expect(
    unzipSync(new Uint8Array(result.bytes))["xl/workbook.xml"]
  ).toBeTruthy()
  expect(transfer).toEqual([result.bytes])
  await host.onmessage!({
    data: { type: "preview", id: 5, sheet: 0, row: 0, column: 0 },
  } as MessageEvent<Request>)
  expect(host.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ type: "preview", id: 5 }),
    []
  )
  await host.onmessage!({
    data: { type: "open", file: new File(["not ODS"], "renamed.ods") },
  } as MessageEvent<Request>)
  expect(host.postMessage).toHaveBeenLastCalledWith(
    { type: "error", error: "unsupported" },
    []
  )
})
