import { afterEach, describe, expect, it, vi } from "vitest"

import {
  dismissLanguageSuggestion,
  isLanguageSuggestionDismissed,
  snoozeLanguageSuggestion,
} from "./language-preference"

describe("language-preference", () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("is not dismissed by default", () => {
    expect(isLanguageSuggestionDismissed()).toBe(false)
  })

  it("persists a permanent dismissal in localStorage", () => {
    dismissLanguageSuggestion()
    expect(localStorage.getItem("langSuggestionDismissed")).toBe("1")
    expect(isLanguageSuggestionDismissed()).toBe(true)
  })

  it("snoozes for the session in sessionStorage", () => {
    snoozeLanguageSuggestion()
    expect(sessionStorage.getItem("langSuggestionSnoozed")).toBe("1")
    expect(localStorage.getItem("langSuggestionDismissed")).toBeNull()
    expect(isLanguageSuggestionDismissed()).toBe(true)
  })

  it("treats storage failures as not dismissed", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled")
    })
    expect(isLanguageSuggestionDismissed()).toBe(false)
  })

  it("swallows storage failures when persisting", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled")
    })
    expect(() => dismissLanguageSuggestion()).not.toThrow()
    expect(() => snoozeLanguageSuggestion()).not.toThrow()
  })
})
