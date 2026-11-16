import { afterEach, expect, test } from "vitest"
import { setupIsolationLinks } from "./isolation-links"

let dispose: (() => void) | undefined
afterEach(() => {
  dispose?.()
  document.body.replaceChildren()
  history.replaceState(null, "", "/")
})

function link(href: string) {
  const anchor = document.createElement("a")
  anchor.href = href
  document.body.append(anchor)
  return anchor
}
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

test("disables speculative loading only for isolated destinations", () => {
  const isolated = link("/zh-CN/tools/ppt-to-pdf-converter/")
  const ordinary = link("/tools/pdf-viewer/")
  const external = link("https://example.org/tools/ppt-to-pdf-converter/")
  const invalid = link("https://[")
  dispose = setupIsolationLinks()
  expect(isolated.dataset.astroPrefetch).toBe("false")
  expect(ordinary.hasAttribute("data-astro-prefetch")).toBe(false)
  expect(external.hasAttribute("data-astro-prefetch")).toBe(false)
  expect(invalid.hasAttribute("data-astro-prefetch")).toBe(false)
})

test("disables background prefetch when leaving an isolated document", () => {
  history.replaceState(null, "", "/tools/ppt-to-pdf-converter/")
  const ordinary = link("/tools/ppt-viewer/")
  dispose = setupIsolationLinks()
  expect(ordinary.dataset.astroPrefetch).toBe("false")
})

test("handles hydrated links and restores existing settings when a result changes", async () => {
  dispose = setupIsolationLinks()
  const container = document.createElement("section")
  container.innerHTML = '<a href="/tools/ppt-to-pdf-converter/">Convert</a>'
  document.body.append(container)
  await flush()
  const dynamic = container.querySelector("a")!
  expect(dynamic.dataset.astroPrefetch).toBe("false")
  dynamic.href = "/tools/pdf-viewer/"
  await flush()
  expect(dynamic.hasAttribute("data-astro-prefetch")).toBe(false)
  dynamic.dataset.astroPrefetch = "tap"
  dynamic.href = "/tools/ppt-to-pdf-converter/"
  await flush()
  dynamic.href = "/tools/docx-viewer/"
  await flush()
  expect(dynamic.dataset.astroPrefetch).toBe("tap")
})

test("releases its observer on disposal", async () => {
  const target = link("/tools/ppt-to-pdf-converter/")
  dispose = setupIsolationLinks()
  expect(target.dataset.astroPrefetch).toBe("false")
  dispose()
  const next = link("/tools/ppt-to-pdf-converter/")
  await flush()
  expect(next.hasAttribute("data-astro-prefetch")).toBe(false)
})
