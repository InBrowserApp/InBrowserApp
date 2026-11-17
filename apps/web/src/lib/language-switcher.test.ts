import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { setupLanguageSwitcher } from "./language-switcher"

let dispose: (() => void) | undefined

beforeEach(() => {
  document.body.innerHTML = `
    <details>
      <summary>Language</summary>
      <div data-language-options>
        <a href="/tools/mac-address-block-lookup/" hreflang="en" aria-current="true">English</a>
        <a href="/zh-TW/tools/mac-address-block-lookup/" hreflang="zh-TW">繁體中文</a>
        <a href="/ja/tools/mac-address-block-lookup/" hreflang="ja">日本語</a>
      </div>
    </details>`
})

afterEach(() => {
  dispose?.()
  vi.restoreAllMocks()
  document.body.replaceChildren()
  sessionStorage.clear()
  window.history.replaceState(null, "", "/")
})

function setup() {
  dispose = setupLanguageSwitcher(
    document.querySelector<HTMLElement>("[data-language-options]")!
  )
}

function japaneseLink() {
  return document.querySelector<HTMLAnchorElement>('a[hreflang="ja"]')!
}

function openMenu() {
  const details = document.querySelector("details")!
  details.open = true
  details.dispatchEvent(new Event("toggle"))
  return japaneseLink()
}

test("keeps encoded query state and hash in each real language link", () => {
  const suffix =
    "?q=Apple+%26+Test&registry=MA-M&org=ACME+%E5%85%AC%E5%8F%B8&page=2#results"
  window.history.replaceState(
    null,
    "",
    `/tools/mac-address-block-lookup/${suffix}`
  )
  setup()

  expect(openMenu().getAttribute("href")).toBe(
    `/ja/tools/mac-address-block-lookup/${suffix}`
  )
  expect(document.querySelector('a[hreflang="en"]')?.getAttribute("href")).toBe(
    `/tools/mac-address-block-lookup/${suffix}`
  )
})

test("reads the latest query whenever the menu opens after replaceState", () => {
  window.history.replaceState(
    null,
    "",
    "/tools/mac-address-block-lookup/?q=first"
  )
  setup()
  expect(openMenu().getAttribute("href")).toBe(
    "/ja/tools/mac-address-block-lookup/?q=first"
  )

  document.querySelector("details")!.open = false
  window.history.replaceState(
    null,
    "",
    "/tools/mac-address-block-lookup/?q=updated&page=3#block"
  )
  expect(openMenu().getAttribute("href")).toBe(
    "/ja/tools/mac-address-block-lookup/?q=updated&page=3#block"
  )
})

test.each(["", "#results"])(
  "preserves a query-free location suffix %s",
  (suffix) => {
    window.history.replaceState(
      null,
      "",
      `/tools/mac-address-block-lookup/${suffix}`
    )
    setup()
    expect(openMenu().getAttribute("href")).toBe(
      `/ja/tools/mac-address-block-lookup/${suffix}`
    )
  }
)

test("keeps the current language first and promotes the preferred browser language", () => {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["ja-JP"])
  setup()
  expect(
    [...document.querySelectorAll("a")].map((link) => link.hreflang)
  ).toEqual(["en", "ja", "zh-TW"])
})

test("snoozes suggestions when the visitor uses a language link", () => {
  setup()
  const link = japaneseLink()
  link.addEventListener("click", (event) => event.preventDefault())
  link.click()
  expect(sessionStorage.getItem("langSuggestionSnoozed")).toBe("1")
})
