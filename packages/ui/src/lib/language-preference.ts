/**
 * Persistent "has the user already dealt with the language suggestion"
 * flag. This is the single source of truth for the storage key, shared by
 * the language-suggestion banner (which sets it on switch/dismiss) and the
 * language switcher (which sets it whenever the user picks a language).
 *
 * Once set, the suggestion banner never shows again — the user has made a
 * language decision, so we stop nudging. All access is wrapped in
 * try/catch because `localStorage` throws when storage is disabled
 * (private mode, blocked cookies); in that case we degrade silently.
 */
const DISMISSED_KEY = "langSuggestionDismissed"
const DISMISSED_VALUE = "1"

function isLanguageSuggestionDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === DISMISSED_VALUE
  } catch {
    return false
  }
}

function dismissLanguageSuggestion(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, DISMISSED_VALUE)
  } catch {
    // storage unavailable — nothing to persist, degrade silently
  }
}

export { dismissLanguageSuggestion, isLanguageSuggestionDismissed }
