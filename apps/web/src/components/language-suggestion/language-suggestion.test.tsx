import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LanguageSuggestion } from "./language-suggestion"

const OPTIONS = [
  { code: "de", href: "/de/tools/", current: true },
  { code: "en", href: "/tools/", current: false },
] as const

function setBrowserLanguages(languages: readonly string[]) {
  Object.defineProperty(navigator, "languages", {
    value: languages,
    configurable: true,
  })
}

describe("LanguageSuggestion", () => {
  beforeEach(() => {
    localStorage.clear()
    setBrowserLanguages(["en-US", "en"])
  })

  afterEach(cleanup)

  it("suggests the visitor's preferred language when it differs", async () => {
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    expect(await screen.findByText("View this page in English?")).toBeTruthy()
    const link = screen.getByRole("link", { name: "Switch to English" })
    expect(link.getAttribute("href")).toBe("/tools/")
  })

  it("renders nothing when the page already matches the preference", async () => {
    setBrowserLanguages(["de-DE", "de"])
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(screen.queryByText(/View this page/)).toBeNull()
  })

  it("renders nothing when no browser language is available", async () => {
    setBrowserLanguages(["ja", "ko"])
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(screen.queryByText(/View this page/)).toBeNull()
  })

  it("hides and persists dismissal when 'Not now' is clicked", async () => {
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    fireEvent.click(await screen.findByRole("button", { name: "Not now" }))

    await waitFor(() => expect(screen.queryByText(/View this page/)).toBeNull())
    expect(localStorage.getItem("langSuggestionDismissed")).toBe("1")
  })

  it("does not render once dismissal has been persisted", async () => {
    localStorage.setItem("langSuggestionDismissed", "1")
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(screen.queryByText(/View this page/)).toBeNull()
  })

  it("persists dismissal when the switch link is followed", async () => {
    render(<LanguageSuggestion options={OPTIONS} currentLanguage="de" />)

    const link = await screen.findByRole("link", { name: "Switch to English" })
    fireEvent.click(link)
    expect(localStorage.getItem("langSuggestionDismissed")).toBe("1")
  })
})
