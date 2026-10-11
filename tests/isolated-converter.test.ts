import { expect, test, vi } from "vitest"
// @ts-expect-error Build-only JavaScript configuration helper.
import { isolatedConverter } from "../apps/web/build/isolated-converter.mjs"

test.each([
  "/tools/ppt-to-pdf-converter/",
  "/tools/odt-to-pdf-converter/",
  "/tools/rtf-to-pdf-converter/",
  "/ar/tools/rtf-to-pdf-converter/",
  "/ko/tools/odt-to-pdf-converter/",
  "/zh-CN/tools/ppt-to-pdf-converter/?query=1",
  "/ar/tools/ppt-to-pdf-converter/",
])("isolates the converter page %s", (url) => {
  const use = vi.fn()
  isolatedConverter().configureServer({ middlewares: { use } })
  const setHeader = vi.fn(),
    next = vi.fn()
  use.mock.calls[0]![0]({ url, headers: {} }, { setHeader }, next)
  expect(setHeader).toHaveBeenCalledWith(
    "Cross-Origin-Opener-Policy",
    "same-origin"
  )
  expect(setHeader).toHaveBeenCalledWith(
    "Cross-Origin-Embedder-Policy",
    "require-corp"
  )
  expect(next).toHaveBeenCalledOnce()
})
test("isolates worker responses without changing unrelated document pages", () => {
  const use = vi.fn()
  isolatedConverter().configureServer({ middlewares: { use } })
  const handler = use.mock.calls[0]![0]
  const setHeader = vi.fn(),
    next = vi.fn()
  handler({ url: "/tools/ppt-viewer/", headers: {} }, { setHeader }, next)
  expect(setHeader).not.toHaveBeenCalled()
  handler(
    {
      url: "/@fs/runtime/office-worker.ts",
      headers: { "sec-fetch-dest": "worker" },
    },
    { setHeader },
    next
  )
  expect(setHeader).toHaveBeenCalledOnce()
  expect(setHeader).toHaveBeenCalledWith(
    "Cross-Origin-Embedder-Policy",
    "require-corp"
  )
})
