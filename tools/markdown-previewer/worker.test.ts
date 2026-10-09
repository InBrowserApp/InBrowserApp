import { afterEach, expect, test, vi } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})
test("parses in a worker and reports parser errors", async () => {
  const worker = {
    onmessage: null as null | ((event: { data: object }) => void),
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", worker)
  await import("./worker")
  worker.onmessage!({
    data: { source: "# Worker", untitled: "Untitled", renderHtml: true },
  })
  expect(worker.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({
      preview: expect.objectContaining({ documentTitle: "Worker" }),
    })
  )
  worker.onmessage!({ data: { source: null } })
  expect(worker.postMessage).toHaveBeenLastCalledWith({ error: true })
})
