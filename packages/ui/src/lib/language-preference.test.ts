import { afterEach, describe, expect, it, vi } from "vitest"

import {
  dismissLanguageSuggestion,
  isLanguageSuggestionDismissed,
} from "./language-preference"

describe("language-preference", () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("is not dismissed by default", () => {
    expect(isLanguageSuggestionDismissed()).toBe(false)
  })

  it("persists and reads back the dismissed flag", () => {
    dismissLanguageSuggestion()
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
  })
})
