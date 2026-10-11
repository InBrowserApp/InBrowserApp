import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { expect, test, vi } from "vitest"

const source = readFileSync(
  "tools/ppt-to-pdf-converter/runtime/network-guard.js",
  "utf8"
)
test("blocks document networking in native worker globals and reports the missing resource", () => {
  const postMessage = vi.fn()
  const worker: Record<string, any> = { postMessage }
  runInNewContext(source, { self: worker })
  expect(() => worker.fetch("https://example.invalid/private")).toThrow(
    "Document network resources"
  )
  for (const method of ["XMLHttpRequest", "WebSocket", "EventSource"])
    expect(() => new worker[method]("https://example.invalid/private")).toThrow(
      "Document network resources"
    )
  expect(postMessage).toHaveBeenCalledTimes(4)
  expect(postMessage).toHaveBeenLastCalledWith({
    documentResourceBlocked: true,
  })
})
