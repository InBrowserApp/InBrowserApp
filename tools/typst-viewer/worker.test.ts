import { expect, test, vi } from "vitest"
const compile = vi.hoisted(() => vi.fn())
vi.mock("./compile", () => ({ compile }))
test("reports stages and transfers only actual PDF buffers", async () => {
  const post = vi.fn()
  vi.stubGlobal("postMessage", post)
  await import("./worker")
  const scope = globalThis as unknown as {
    onmessage: (e: { data: File }) => Promise<void>
  }
  const file = new File(["= Title"], "test.typ")
  const pdf = new ArrayBuffer(2)
  compile.mockImplementationOnce(async (_file, progress) => {
    progress("reading")
    return { pdf, diagnostics: [] }
  })
  await scope.onmessage({ data: file })
  expect(post).toHaveBeenCalledWith({ type: "progress", phase: "reading" })
  expect(post).toHaveBeenCalledWith(
    { type: "complete", pdf, diagnostics: [] },
    [pdf]
  )
  compile.mockResolvedValueOnce({ error: "failed", diagnostics: [] })
  await scope.onmessage({ data: file })
  expect(post).toHaveBeenLastCalledWith(
    { type: "complete", error: "failed", diagnostics: [] },
    []
  )
  vi.unstubAllGlobals()
})
