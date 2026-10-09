import { afterEach, expect, test, vi } from "vitest"
import { normalizeSpreadsheet } from "./normalize"
vi.mock("./normalize", () => ({ normalizeSpreadsheet: vi.fn() }))
afterEach(() => vi.unstubAllGlobals())
test("returns transferable output and serializes parsing errors without document contents", async () => {
  const scope = {
    onmessage: null as ((event: MessageEvent) => void) | null,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./import.worker")
  const result = { data: new ArrayBuffer(2), names: ["Table"], notices: [] }
  vi.mocked(normalizeSpreadsheet).mockReturnValueOnce(result)
  const event = new MessageEvent("message", {
    data: {
      data: new ArrayBuffer(1),
      name: "test.csv",
      options: { delimiter: "auto", encoding: "auto" },
    },
  })
  scope.onmessage!(event)
  expect(scope.postMessage).toHaveBeenLastCalledWith(
    { result },
    { transfer: [result.data] }
  )
  for (const [error, message] of [
    [new RangeError("allocation"), "TOO_LARGE"],
    [new Error("INVALID"), "INVALID"],
    [null, "INVALID"],
  ]) {
    vi.mocked(normalizeSpreadsheet).mockImplementationOnce(() => {
      throw error
    })
    scope.onmessage!(event)
    expect(scope.postMessage).toHaveBeenLastCalledWith({ error: message })
  }
})
