import { afterEach, expect, test, vi } from "vitest"
import { Session } from "../session"
import type { Request } from "../types"
vi.mock("../session", () => ({ Session: { open: vi.fn() } }))
afterEach(() => vi.unstubAllGlobals())
test("worker opens, pages, reports export progress and returns generic errors", async () => {
  const scope = {
    onmessage: null as null | ((event: MessageEvent<Request>) => Promise<void>),
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  const session = {
    info: { rows: 2 },
    page: vi.fn().mockResolvedValue([{ a: 1 }]),
    export: vi.fn().mockImplementation((_start, _end, _format, progress) => {
      progress(2)
      return { rows: 2 }
    }),
  }
  vi.mocked(Session.open).mockResolvedValue(session as unknown as Session)
  await import("./reader.worker")
  const send = (data: Request) =>
    scope.onmessage!(new MessageEvent("message", { data }))
  await send({ id: 1, type: "open", file: new File([], "file.parquet") })
  expect(scope.postMessage).toHaveBeenLastCalledWith({
    id: 1,
    result: { rows: 2 },
  })
  await send({ id: 2, type: "page", start: 0, end: 2 })
  expect(scope.postMessage).toHaveBeenLastCalledWith({
    id: 2,
    result: [{ a: 1 }],
  })
  await send({ id: 3, type: "export", start: 0, end: 2, format: "json" })
  expect(scope.postMessage).toHaveBeenCalledWith({ id: 3, progress: 2 })
  expect(scope.postMessage).toHaveBeenLastCalledWith({
    id: 3,
    result: { rows: 2 },
  })
  session.page.mockRejectedValueOnce(new Error("private file contents"))
  await send({ id: 4, type: "page", start: 0, end: 2 })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ id: 4, error: true })
})
