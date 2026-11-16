import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { setupPwaInstall } from "./pwa-install"

let dispose: () => void
let button: HTMLButtonElement

beforeEach(() => {
  button = document.createElement("button")
  button.dataset.pwaInstall = ""
  button.hidden = true
  button.innerHTML = "<span>Install app</span>"
  document.body.append(button)
  dispose = setupPwaInstall()
})

afterEach(() => {
  dispose()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function offerInstall(prompt = vi.fn().mockResolvedValue(undefined)) {
  const event = new Event("beforeinstallprompt", { cancelable: true })
  Object.assign(event, { prompt })
  window.dispatchEvent(event)
  return { event, prompt }
}

test("stays hidden until the browser offers installation", () => {
  expect(button.hidden).toBe(true)
  button.click()
  const { event, prompt } = offerInstall()
  expect(event.defaultPrevented).toBe(true)
  expect(button.hidden).toBe(false)
  expect(prompt).not.toHaveBeenCalled()
})

test("opens the native prompt from a click and consumes it only once", () => {
  const { prompt } = offerInstall()
  button.querySelector("span")!.click()
  expect(prompt).toHaveBeenCalledOnce()
  expect(button.hidden).toBe(true)
  button.click()
  expect(prompt).toHaveBeenCalledOnce()
})

test("waits for a fresh event after dismissal or failure", async () => {
  const { prompt } = offerInstall(
    vi.fn().mockRejectedValue(new Error("Prompt no longer available"))
  )
  button.click()
  await Promise.resolve()
  expect(prompt).toHaveBeenCalledOnce()
  expect(button.hidden).toBe(true)

  const next = offerInstall()
  expect(button.hidden).toBe(false)
  button.click()
  expect(next.prompt).toHaveBeenCalledOnce()
})

test("clears the action when the app is installed through the browser", () => {
  const { prompt } = offerInstall()
  window.dispatchEvent(new Event("appinstalled"))
  expect(button.hidden).toBe(true)
  button.click()
  expect(prompt).not.toHaveBeenCalled()
})

test("does not offer installation in an installed app window", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList)
  const { prompt } = offerInstall()
  expect(button.hidden).toBe(true)
  button.click()
  expect(prompt).not.toHaveBeenCalled()
})

test("keeps the pending prompt across Astro navigation and uses the new button", () => {
  const { prompt } = offerInstall()
  const next = button.cloneNode(true) as HTMLButtonElement
  next.hidden = true
  button.replaceWith(next)
  document.dispatchEvent(new Event("astro:after-swap"))
  expect(next.hidden).toBe(false)
  document.body.click()
  document.dispatchEvent(new MouseEvent("click"))
  expect(prompt).not.toHaveBeenCalled()
  next.click()
  expect(prompt).toHaveBeenCalledOnce()
  expect(next.hidden).toBe(true)
})

test("keeps a consumed prompt hidden after Astro navigation", () => {
  offerInstall()
  button.click()
  const next = button.cloneNode(true) as HTMLButtonElement
  button.replaceWith(next)
  document.dispatchEvent(new Event("astro:after-swap"))
  expect(next.hidden).toBe(true)
})

test("removes its listeners when disposed", () => {
  dispose()
  const { event } = offerInstall()
  expect(event.defaultPrevented).toBe(false)
  expect(button.hidden).toBe(true)
})
