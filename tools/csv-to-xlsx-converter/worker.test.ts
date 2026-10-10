import { readFileSync } from "node:fs"
import { afterEach, expect, test, vi } from "vitest"
import { read } from "xlsx"
import { defaultOptions } from "./options"
import type { ImportOptions } from "./options"
import type { Request, Response } from "./types"

afterEach(() => vi.unstubAllGlobals())
test("configures a conversion, transfers an actual XLSX, then previews the same text", async () => {
  vi.resetModules()
  const host = {
    onmessage: null as
      | ((
          event: MessageEvent<
            Request | { type: "configure"; options: ImportOptions }
          >
        ) => Promise<void>)
      | null,
    postMessage: vi.fn<(message: Response, transfer: Transferable[]) => void>(),
  }
  vi.stubGlobal("self", host)
  await import("./worker")
  await host.onmessage!({
    data: { type: "configure", options: { ...defaultOptions, header: true } },
  } as MessageEvent)
  const bytes = readFileSync("tools/csv-to-xlsx-converter/fixtures/typed.csv")
  await host.onmessage!({
    data: { type: "open", file: new File([bytes], "typed.csv") },
  } as MessageEvent)
  const [result, transfer] = host.postMessage.mock.calls[0]!
  expect(result.type).toBe("ready")
  if (result.type !== "ready") throw new Error("Expected XLSX")
  const sheet = read(result.bytes).Sheets.Sheet1!
  expect(sheet.A2).toMatchObject({ t: "s", v: "00123" })
  expect(sheet["!autofilter"]).toEqual({ ref: "A1:F7" })
  expect(transfer).toEqual([result.bytes])
  await host.onmessage!({
    data: { type: "preview", id: 5, sheet: 0, row: 1, column: 0 },
  } as MessageEvent)
  expect(host.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({
      type: "preview",
      id: 5,
      preview: expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            number: 2,
            cells: expect.arrayContaining([
              expect.objectContaining({ text: "00123", raw: "00123" }),
            ]),
          }),
        ]),
      }),
    }),
    []
  )
  await host.onmessage!({
    data: { type: "open", file: new File(['"unclosed'], "bad.csv") },
  } as MessageEvent)
  expect(host.postMessage).toHaveBeenLastCalledWith(
    { type: "error", error: "invalid" },
    []
  )
})
