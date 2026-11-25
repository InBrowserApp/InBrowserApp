import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { getInstallTarget } from "./install-target"
import { setupPwaInstall } from "./pwa-install"

let dispose: () => void
let link: HTMLAnchorElement

function offerInstall(prompt = vi.fn().mockResolvedValue(undefined)) {
  const event = new Event("beforeinstallprompt", { cancelable: true })
  Object.assign(event, { prompt })
  window.dispatchEvent(event)
  return { event, prompt }
}

function click(options?: MouseEventInit) {
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    ...options,
  })
  link.querySelector("span")!.dispatchEvent(event)
  return event
}

describe("install action", () => {
  beforeEach(() => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "iPhone Version/26.0 Safari/605.1.15"
    )
    link = document.createElement("a")
    link.dataset.pwaInstallTrigger = ""
    link.href = "/zh-CN/install/"
    link.innerHTML = "<span>Install app</span>"
    document.body.append(link)
    dispose = setupPwaInstall()
  })

  afterEach(() => {
    dispose()
    document.body.replaceChildren()
    vi.restoreAllMocks()
  })

  test("sets a localized fallback link and leaves browser navigation available", () => {
    expect(new URL(link.href).pathname).toBe("/zh-CN/install/ios-safari/")
    expect(click().defaultPrevented).toBe(false)
  })

  test("opens the native prompt from a plain click and consumes it once", () => {
    const href = link.href
    const { event, prompt } = offerInstall()
    expect(event.defaultPrevented).toBe(true)
    expect(link.href).toBe(href)
    expect(prompt).not.toHaveBeenCalled()
    expect(click().defaultPrevented).toBe(true)
    expect(prompt).toHaveBeenCalledOnce()
    expect(click().defaultPrevented).toBe(false)
    expect(prompt).toHaveBeenCalledOnce()
  })

  test("keeps modified clicks and other links available", () => {
    const { prompt } = offerInstall()
    expect(click({ ctrlKey: true }).defaultPrevented).toBe(false)
    expect(click({ metaKey: true }).defaultPrevented).toBe(false)
    expect(click({ button: 1 }).defaultPrevented).toBe(false)
    document.body.click()
    expect(prompt).not.toHaveBeenCalled()
    click()
    expect(prompt).toHaveBeenCalledOnce()
  })

  test("opens the guide when the browser rejects the native prompt", async () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    offerInstall(
      vi.fn().mockRejectedValue(new Error("Prompt no longer available"))
    )
    expect(click().defaultPrevented).toBe(true)
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith(link.href))
    expect(click().defaultPrevented).toBe(false)
  })

  test("accepts a fresh prompt after the earlier one was used", () => {
    offerInstall()
    click()
    const { prompt } = offerInstall()
    click()
    expect(prompt).toHaveBeenCalledOnce()
  })

  test("returns to the guide if installation happens through the browser", () => {
    const { prompt } = offerInstall()
    window.dispatchEvent(new Event("appinstalled"))
    expect(click().defaultPrevented).toBe(false)
    expect(prompt).not.toHaveBeenCalled()
  })

  test("does not open an install prompt in a standalone window", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList)
    const { prompt } = offerInstall()
    expect(click().defaultPrevented).toBe(false)
    expect(prompt).not.toHaveBeenCalled()
  })

  test("removes its listeners when disposed", () => {
    dispose()
    const { event } = offerInstall()
    expect(event.defaultPrevented).toBe(false)
    expect(click().defaultPrevented).toBe(false)
  })
})

describe("install guide selection", () => {
  const macSafari = "Macintosh Version/26.0 Safari/605.1.15"

  test.each([
    ["iPhone Version/26.0 Safari/605.1.15", 1, "ios-safari"],
    [macSafari, 5, "ios-safari"],
    ["iPhone CriOS/154.0 Safari/605.1.15", 1, "ios-other"],
    ["iPhone Version/26.0 Safari/605.1.15 Instagram", 1, "ios-other"],
    ["iPhone AppleWebKit/605.1.15 Mobile/15E148", 1, "ios-other"],
    ["Linux; Android 17 Chrome/154.0", 5, "android-chrome"],
    ["Android 17; wv Chrome/154.0", 5, "android-other"],
    ["Android 17 Chrome/154.0 EdgA/154.0", 5, "android-other"],
    [
      "Android 17 Chrome/154.0 SamsungBrowser/29.0",
      5,
      "android-samsung-internet",
    ],
    ["Android 17 Firefox/154.0", 5, "android-firefox"],
    ["Windows NT 10.0 Chrome/154.0 Edg/154.0", 0, "desktop-edge"],
    ["Windows NT 10.0 Chrome/154.0", 0, "desktop-chrome"],
    ["Windows NT 10.0 Firefox/154.0", 0, "windows-firefox"],
    [macSafari, 0, "macos-safari"],
    ["X11; Linux x86_64 Firefox/154.0", 0, undefined],
    ["X11; Linux x86_64 Chrome/154.0 OPR/152.0", 0, undefined],
    ["unknown", 0, undefined],
  ])("routes %s", (userAgent, maxTouchPoints, expected) => {
    expect(getInstallTarget({ userAgent, maxTouchPoints })).toBe(expected)
  })

  test("uses browser brands to disambiguate Chromium user agents", () => {
    const browser = {
      userAgent: "Windows NT 10.0 Chrome/154.0",
      maxTouchPoints: 0,
    }
    expect(
      getInstallTarget({
        ...browser,
        userAgentData: { brands: [{ brand: "Brave" }] },
      })
    ).toBeUndefined()
    expect(
      getInstallTarget({
        ...browser,
        userAgentData: { brands: [{ brand: "Google Chrome" }] },
      })
    ).toBe("desktop-chrome")
  })
})
