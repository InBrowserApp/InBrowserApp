import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { setupLanguageSuggestion } from "./language-suggestion"

function setBrowserLanguages(languages: readonly string[]) {
  Object.defineProperty(navigator, "languages", {
    value: languages,
    configurable: true,
  })
}

function setPage(language = "de", pathname = "/tools/") {
  document.documentElement.lang = language
  document.head.innerHTML = `
    <link rel="alternate" hreflang="de" href="https://inbrowser.app/de${pathname}">
    <link rel="alternate" hreflang="en" href="https://inbrowser.app${pathname}">
    <link rel="alternate" hreflang="x-default" href="https://inbrowser.app${pathname}">
  `
  document.body.innerHTML = `
    <template id="language-suggestion-template">
      <div role="status" aria-live="polite">
        <div data-content>
          <p data-message></p>
          <button data-close></button>
          <button data-dismiss></button>
          <a data-switch></a>
        </div>
      </div>
    </template>
  `
}

function banner() {
  return document.querySelector('[role="status"]')
}

describe("language suggestion", () => {
  let cleanup: (() => void) | undefined

  function start() {
    cleanup = setupLanguageSuggestion()
    vi.runAllTimers()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    // Exercise the Safari fallback deterministically.
    vi.stubGlobal("requestIdleCallback", undefined)
    localStorage.clear()
    sessionStorage.clear()
    setBrowserLanguages(["en-US", "en"])
    setPage()
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
    document.head.innerHTML = ""
    document.body.innerHTML = ""
    document.documentElement.lang = ""
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("keeps the template inert until idle, then uses the alternate URL", () => {
    cleanup = setupLanguageSuggestion()
    expect(banner()).toBeNull()
    vi.runAllTimers()

    expect(banner()?.textContent).toContain("View this page in English?")
    const link = banner()!.querySelector<HTMLAnchorElement>("a")!
    expect(link.textContent).toBe("Switch to English")
    expect(link.pathname).toBe("/tools/")
    expect(link.getAttribute("href")).toBe("/tools/")
    expect(link.hreflang).toBe("en")
  })

  it.each([["de-DE", "de"], ["ja", "ko"], ["x-default"]])(
    "renders nothing when %j needs no suggestion",
    (...languages) => {
      setBrowserLanguages(languages)
      start()
      expect(banner()).toBeNull()
    }
  )

  it("does not suggest a language unavailable on this page", () => {
    document.head.querySelector('[hreflang="en"]')!.remove()
    start()
    expect(banner()).toBeNull()
  })

  it("permanently dismisses when No thanks is clicked", () => {
    start()
    banner()!.querySelector<HTMLButtonElement>("[data-dismiss]")!.click()
    expect(banner()).toBeNull()
    expect(localStorage.getItem("langSuggestionDismissed")).toBe("1")
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBeNull()
  })

  it.each(["click", "Escape"])("snoozes for the session on %s", (action) => {
    start()
    if (action === "click") {
      banner()!.querySelector<HTMLButtonElement>("[data-close]")!.click()
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    }
    expect(banner()).toBeNull()
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBe("1")
    expect(localStorage.getItem("langSuggestionDismissed")).toBeNull()
  })

  it.each(["localStorage", "sessionStorage"] as const)(
    "renders nothing when dismissed in %s",
    (storage) => {
      const key =
        storage === "localStorage"
          ? "langSuggestionDismissed"
          : "langSuggestionSnoozed"
      window[storage].setItem(key, "1")
      start()
      expect(banner()).toBeNull()
    }
  )

  it("only snoozes when the switch link is followed", () => {
    start()
    const link = banner()!.querySelector<HTMLAnchorElement>("[data-switch]")!
    // Keep the test on this document while exercising the click listener.
    link.addEventListener("click", (event) => event.preventDefault())
    link.click()
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBe("1")
    expect(localStorage.getItem("langSuggestionDismissed")).toBeNull()
  })

  it("rechecks dismissal after waiting for idle", () => {
    cleanup = setupLanguageSuggestion()
    sessionStorage.setItem("langSuggestionSnoozed", "1")
    vi.runAllTimers()
    expect(banner()).toBeNull()
  })

  it("uses target-language copy, native name and RTL direction", () => {
    setBrowserLanguages(["ar"])
    document.head.insertAdjacentHTML(
      "beforeend",
      '<link rel="alternate" hreflang="ar" href="/ar/tools/">'
    )
    start()
    const content = banner()!.querySelector<HTMLElement>("[data-content]")!
    expect(content.lang).toBe("ar")
    expect(content.dir).toBe("rtl")
    expect(content.textContent).toContain("العربية")
    expect(
      banner()!.querySelector("button")!.getAttribute("aria-label")
    ).toBeTruthy()
  })

  it("cancels pending detection when disposed", () => {
    cleanup = setupLanguageSuggestion()
    cleanup()
    vi.runAllTimers()
    expect(banner()).toBeNull()
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBeNull()
  })

  it("removes Escape listeners when disposed", () => {
    start()
    cleanup!()
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBeNull()
  })

  it("bounds and cancels requestIdleCallback when available", () => {
    const request = vi.fn(() => 42)
    const cancel = vi.fn()
    vi.stubGlobal("requestIdleCallback", request)
    vi.stubGlobal("cancelIdleCallback", cancel)
    cleanup = setupLanguageSuggestion()

    expect(request).toHaveBeenCalledWith(expect.any(Function), {
      timeout: 2000,
    })
    cleanup()
    expect(cancel).toHaveBeenCalledWith(42)
  })
})
