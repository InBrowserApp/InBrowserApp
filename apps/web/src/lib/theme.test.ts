import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { setupThemeControls } from "./theme"

let dispose: (() => void) | undefined
let media: MediaQueryList

function renderControls() {
  document.body.innerHTML = ["light", "dark", "system"]
    .map(
      (theme) =>
        `<button data-theme-option="${theme}"><span>${theme}</span></button>`
    )
    .join("")
}

function choose(theme: string) {
  document
    .querySelector<HTMLSpanElement>(`[data-theme-option="${theme}"] span`)!
    .click()
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.dataset.theme = "system"
  document.documentElement.classList.remove("dark")
  media = new EventTarget() as MediaQueryList
  Object.defineProperty(media, "matches", { value: false, writable: true })
  vi.spyOn(window, "matchMedia").mockReturnValue(media)
  renderControls()
})

afterEach(() => {
  dispose?.()
  vi.restoreAllMocks()
  document.body.replaceChildren()
  document.documentElement.classList.remove("dark")
  delete document.documentElement.dataset.theme
  localStorage.clear()
})

test("uses the theme applied before paint and marks its selected option", () => {
  document.documentElement.dataset.theme = "dark"
  dispose = setupThemeControls()
  expect(document.documentElement.classList.contains("dark")).toBe(true)
  expect(
    document
      .querySelector('[aria-pressed="true"]')
      ?.getAttribute("data-theme-option")
  ).toBe("dark")
  expect(localStorage.getItem("theme")).toBeNull()
})

test("switches and persists all three themes when an option's child is clicked", () => {
  dispose = setupThemeControls()
  for (const theme of ["dark", "light", "system"]) {
    choose(theme)
    expect(document.documentElement.dataset.theme).toBe(theme)
    expect(localStorage.getItem("theme")).toBe(theme)
    expect(document.documentElement.classList.contains("dark")).toBe(
      theme === "dark"
    )
    expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1)
  }
})

test("follows system changes only when the system option is selected", () => {
  dispose = setupThemeControls()
  Object.defineProperty(media, "matches", { value: true })
  media.dispatchEvent(new Event("change"))
  expect(document.documentElement.classList.contains("dark")).toBe(true)
  choose("light")
  media.dispatchEvent(new Event("change"))
  expect(document.documentElement.classList.contains("dark")).toBe(false)
  choose("system")
  expect(document.documentElement.classList.contains("dark")).toBe(true)
  choose("dark")
  Object.defineProperty(media, "matches", { value: false })
  media.dispatchEvent(new Event("change"))
  expect(document.documentElement.classList.contains("dark")).toBe(true)
})

test("continues switching when persistence is blocked", () => {
  vi.spyOn(localStorage, "setItem").mockImplementation(() => {
    throw new Error("Storage blocked")
  })
  dispose = setupThemeControls()
  choose("dark")
  expect(document.documentElement.dataset.theme).toBe("dark")
  expect(document.documentElement.classList.contains("dark")).toBe(true)
})

test("refreshes controls after Astro navigation without retaining the old DOM", () => {
  dispose = setupThemeControls()
  choose("dark")
  renderControls()
  document.dispatchEvent(new Event("astro:page-load"))
  expect(
    document
      .querySelector('[data-theme-option="dark"]')
      ?.getAttribute("aria-pressed")
  ).toBe("true")
  choose("light")
  expect(document.documentElement.classList.contains("dark")).toBe(false)
})
