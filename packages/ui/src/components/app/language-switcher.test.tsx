import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { LanguageSwitcher } from "./language-switcher"

const options = [
  {
    code: "en",
    href: "/tools/mac-address-block-lookup/",
    label: "English",
    current: true,
  },
  {
    code: "ja",
    href: "/ja/tools/mac-address-block-lookup/",
    label: "日本語",
  },
] as const

afterEach(() => {
  cleanup()
  window.history.replaceState(null, "", "/")
})

function openMenu() {
  fireEvent.keyDown(screen.getByRole("button", { name: "Language" }), {
    key: "ArrowDown",
  })
  return screen.findByRole("menuitem", { name: "日本語" })
}

test("keeps encoded query state and hash in each real language link", async () => {
  const suffix =
    "?q=Apple+%26+Test&registry=MA-M&org=ACME+%E5%85%AC%E5%8F%B8&page=2#results"
  window.history.replaceState(
    null,
    "",
    `/tools/mac-address-block-lookup/${suffix}`
  )
  render(<LanguageSwitcher label="Language" options={options} />)

  const japanese = await openMenu()
  expect(japanese.tagName).toBe("A")
  expect(japanese.getAttribute("href")).toBe(
    `/ja/tools/mac-address-block-lookup/${suffix}`
  )
  expect(japanese.getAttribute("hrefLang")).toBe("ja")
  expect(
    screen.getByRole("menuitem", { name: "English" }).getAttribute("href")
  ).toBe(`/tools/mac-address-block-lookup/${suffix}`)
})

test("reads the latest query whenever the menu opens after replaceState", async () => {
  window.history.replaceState(
    null,
    "",
    "/tools/mac-address-block-lookup/?q=first"
  )
  render(<LanguageSwitcher label="Language" options={options} />)
  expect((await openMenu()).getAttribute("href")).toBe(
    "/ja/tools/mac-address-block-lookup/?q=first"
  )

  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" })
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  window.history.replaceState(
    null,
    "",
    "/tools/mac-address-block-lookup/?q=updated&page=3#block"
  )
  expect((await openMenu()).getAttribute("href")).toBe(
    "/ja/tools/mac-address-block-lookup/?q=updated&page=3#block"
  )
})

test.each(["", "#results"])(
  "preserves a query-free location suffix %s",
  async (suffix) => {
    window.history.replaceState(
      null,
      "",
      `/tools/mac-address-block-lookup/${suffix}`
    )
    render(<LanguageSwitcher label="Language" options={options} />)
    expect((await openMenu()).getAttribute("href")).toBe(
      `/ja/tools/mac-address-block-lookup/${suffix}`
    )
  }
)
