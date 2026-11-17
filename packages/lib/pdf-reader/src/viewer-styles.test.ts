// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { loadViewerStyles } from "./viewer-styles"

vi.mock("./viewer.css?url", () => ({ default: "/pdf-viewer.css" }))

afterEach(() => {
  document.head.querySelectorAll("link").forEach((link) => link.remove())
})

function currentLink() {
  return document.head.querySelector<HTMLLinkElement>(
    'link[href="/pdf-viewer.css"]'
  )!
}

test("shares one stylesheet request and waits for it before resolving", async () => {
  const loaded = vi.fn()
  const first = loadViewerStyles()
  const second = loadViewerStyles()
  void first.then(loaded)
  expect(first).toBe(second)
  expect(document.head.querySelectorAll("link")).toHaveLength(1)
  expect(currentLink().rel).toBe("stylesheet")
  await Promise.resolve()
  expect(loaded).not.toHaveBeenCalled()

  currentLink().dispatchEvent(new Event("load"))
  await first
  expect(loaded).toHaveBeenCalledOnce()
  expect(loadViewerStyles()).toBe(first)
})

test("removes a failed stylesheet so the next document can retry", async () => {
  const first = loadViewerStyles()
  currentLink().dispatchEvent(new Event("error"))
  await expect(first).rejects.toThrow("Could not load PDF viewer styles.")
  expect(currentLink()).toBeNull()

  const retry = loadViewerStyles()
  expect(retry).not.toBe(first)
  currentLink().dispatchEvent(new Event("load"))
  await retry
})

test("reloads after a previously loaded stylesheet is removed", async () => {
  const first = loadViewerStyles()
  const oldLink = currentLink()
  oldLink.dispatchEvent(new Event("load"))
  await first
  oldLink.remove()

  const next = loadViewerStyles()
  expect(currentLink()).not.toBe(oldLink)
  currentLink().dispatchEvent(new Event("load"))
  await next
})

test("a detached request failing does not remove its replacement", async () => {
  const first = loadViewerStyles()
  const oldLink = currentLink()
  oldLink.remove()
  const replacement = loadViewerStyles()
  const newLink = currentLink()
  oldLink.dispatchEvent(new Event("error"))
  await expect(first).rejects.toThrow("Could not load PDF viewer styles.")
  expect(loadViewerStyles()).toBe(replacement)
  expect(newLink.isConnected).toBe(true)
  newLink.dispatchEvent(new Event("load"))
  await replacement
})
