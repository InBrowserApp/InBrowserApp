import { Blob } from "node:buffer"
import { afterEach, expect, test, vi } from "vitest"
import type { Request, Response } from "./types"
afterEach(() => {
  vi.restoreAllMocks()
  self.onmessage = null
})
test("worker decodes once, navigates all sections/lines, searches, and suppresses cancelled results", async () => {
  vi.resetModules()
  const send = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./reader.worker")
  const request = (data: Request) =>
    (self.onmessage as unknown as (event: { data: Request }) => Promise<void>)({
      data,
    })
  const file = new Blob([
    Array.from({ length: 1001 }, (_, i) => `line ${i}`).join("\n"),
  ]) as unknown as File
  await request({ id: 1, kind: "open", file, encoding: "auto" })
  expect(send).toHaveBeenLastCalledWith(
    expect.objectContaining({
      metadata: { encoding: "utf-8", lines: 1001, sections: 4 },
    })
  )
  await request({ id: 2, kind: "section", index: 1 })
  expect(send).toHaveBeenLastCalledWith(
    expect.objectContaining({ target: 257 })
  )
  await request({ id: 3, kind: "line", line: 800 })
  expect(send).toHaveBeenLastCalledWith(
    expect.objectContaining({ target: 800 })
  )
  await request({ id: 4, kind: "end" })
  expect(send).toHaveBeenLastCalledWith(
    expect.objectContaining({ target: 1001, end: true })
  )
  await request({
    id: 5,
    kind: "search",
    query: "line 1000",
    from: 0,
    direction: 1,
  })
  expect(send.mock.lastCall?.[0] as Response).toMatchObject({
    match: { line: 1001 },
    target: 1001,
  })
  await request({
    id: 6,
    kind: "search",
    query: "missing",
    from: 0,
    direction: 1,
  })
  expect(send).toHaveBeenLastCalledWith(
    expect.objectContaining({ match: null })
  )
  const pending = request({
    id: 7,
    kind: "search",
    query: "missing",
    from: 0,
    direction: 1,
  })
  await request({ id: 8, kind: "section", index: 0 })
  await pending
  expect(send).toHaveBeenLastCalledWith(expect.objectContaining({ id: 8 }))
  await request({
    id: 9,
    kind: "open",
    file: new Blob([Uint8Array.of(255)]) as unknown as File,
    encoding: "auto",
  })
  expect(send).toHaveBeenLastCalledWith({ id: 9, error: "encodingError" })
})
