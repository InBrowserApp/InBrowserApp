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

test("disables prefetch and router interception only for isolated destinations", () => {
  const isolated = link("/zh-CN/tools/ppt-to-pdf-converter/")
  const ordinary = link("/tools/pdf-viewer/")
  const external = link("https://example.org/tools/ppt-to-pdf-converter/")
  const invalid = link("https://[")
  dispose = setupIsolationLinks()
  expect(isolated.dataset.astroPrefetch).toBe("false")
  expect(isolated.hasAttribute("data-astro-reload")).toBe(true)
  expect(ordinary.hasAttribute("data-astro-prefetch")).toBe(false)
  expect(external.hasAttribute("data-astro-prefetch")).toBe(false)
  expect(invalid.hasAttribute("data-astro-prefetch")).toBe(false)
})

test("disables background prefetch when leaving an isolated document", () => {
  history.replaceState(null, "", "/tools/ppt-to-pdf-converter/")
  const ordinary = link("/tools/ppt-viewer/")
  dispose = setupIsolationLinks()
  expect(ordinary.dataset.astroPrefetch).toBe("false")
  expect(ordinary.hasAttribute("data-astro-reload")).toBe(true)
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
  expect(dynamic.hasAttribute("data-astro-reload")).toBe(false)
  dynamic.dataset.astroPrefetch = "tap"
  dynamic.setAttribute("data-astro-reload", "keep")
  dynamic.href = "/tools/ppt-to-pdf-converter/"
  await flush()
  dynamic.href = "/tools/docx-viewer/"
  await flush()
  expect(dynamic.dataset.astroPrefetch).toBe("tap")
  expect(dynamic.getAttribute("data-astro-reload")).toBe("keep")
})

test("refreshes after an Astro page swap and releases its observer on disposal", async () => {
  dispose = setupIsolationLinks()
  const body = document.createElement("body")
  document.body.replaceWith(body)
  const target = link("/tools/ppt-to-pdf-converter/")
  document.dispatchEvent(new Event("astro:after-swap"))
  expect(target.dataset.astroPrefetch).toBe("false")
  dispose()
  const next = link("/tools/ppt-to-pdf-converter/")
  await flush()
  expect(next.hasAttribute("data-astro-prefetch")).toBe(false)
})
