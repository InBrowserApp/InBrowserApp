import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { setupPwaInstall } from "./pwa-install"

let dispose: () => void
let control: HTMLDivElement
let trigger: HTMLElement

beforeEach(() => {
  control = document.createElement("div")
  control.dataset.pwaInstall = ""
  control.hidden = true
  control.innerHTML =
    '<details><summary role="button" data-pwa-install-trigger><span>Install app</span></summary></details><span aria-hidden="true"></span>'
  trigger = control.querySelector("summary")!
  document.body.append(control)
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
  expect(control.hidden).toBe(true)
  trigger.click()
  const { event, prompt } = offerInstall()
  expect(event.defaultPrevented).toBe(true)
  expect(control.hidden).toBe(false)
  expect(prompt).not.toHaveBeenCalled()
})

test("opens the native prompt from a click and consumes it only once", () => {
  const { prompt } = offerInstall()
  const click = new MouseEvent("click", { bubbles: true, cancelable: true })
  trigger.querySelector("span")!.dispatchEvent(click)
  expect(prompt).toHaveBeenCalledOnce()
  expect(control.hidden).toBe(false)
  expect(trigger.getAttribute("aria-disabled")).toBe("true")
  expect(click.defaultPrevented).toBe(true)
  trigger.click()
  expect(prompt).toHaveBeenCalledOnce()
})

test("waits for a fresh event after dismissal or failure", async () => {
  const { prompt } = offerInstall(
    vi.fn().mockRejectedValue(new Error("Prompt no longer available"))
  )
  trigger.click()
  await Promise.resolve()
  expect(prompt).toHaveBeenCalledOnce()
  expect(control.hidden).toBe(false)
  expect(trigger.getAttribute("aria-disabled")).toBe("true")

  const next = offerInstall()
  expect(control.hidden).toBe(false)
  expect(trigger.getAttribute("aria-disabled")).toBe("false")
  trigger.click()
  expect(next.prompt).toHaveBeenCalledOnce()
})

test("clears the action when the app is installed through the browser", () => {
  const { prompt } = offerInstall()
  window.dispatchEvent(new Event("appinstalled"))
  expect(control.hidden).toBe(true)
  trigger.click()
  expect(prompt).not.toHaveBeenCalled()
})

test("does not offer installation in an installed app window", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList)
  const { prompt } = offerInstall()
  expect(control.hidden).toBe(true)
  trigger.click()
  expect(prompt).not.toHaveBeenCalled()
})

test("keeps the pending prompt across Astro navigation and uses the new button", () => {
  const { prompt } = offerInstall()
  const next = control.cloneNode(true) as HTMLDivElement
  next.hidden = true
  control.replaceWith(next)
  document.dispatchEvent(new Event("astro:after-swap"))
  expect(next.hidden).toBe(false)
  document.body.click()
  document.dispatchEvent(new MouseEvent("click"))
  expect(prompt).not.toHaveBeenCalled()
  next.querySelector("summary")!.click()
  expect(prompt).toHaveBeenCalledOnce()
  expect(next.hidden).toBe(false)
})

test("keeps the icon visible after consuming a prompt and navigating", () => {
  offerInstall()
  trigger.click()
  const next = control.cloneNode(true) as HTMLDivElement
  control.replaceWith(next)
  document.dispatchEvent(new Event("astro:after-swap"))
  expect(next.hidden).toBe(false)
  expect(next.querySelector("summary")!.getAttribute("aria-disabled")).toBe(
    "true"
  )
})

test("removes its listeners when disposed", () => {
  dispose()
  const { event } = offerInstall()
  expect(event.defaultPrevented).toBe(false)
  expect(control.hidden).toBe(true)
})
