/**
 * Persistence for how the visitor has dealt with the language-suggestion
 * banner. This is the single source of truth for the storage keys, shared
 * by the banner and the language switcher.
 *
 * There are two levels:
 *   - permanent ("No thanks" button, switching language, using the
 *     switcher) → `localStorage`, never suggest again.
 *   - session ("✕" close icon) → `sessionStorage`, hidden for this
 *     browsing session but offered again on the visitor's next visit.
 *
 * All access is wrapped in try/catch because storage throws when disabled
 * (private mode, blocked cookies); in that case we degrade silently.
 */
const DISMISSED_KEY = "langSuggestionDismissed"
const SNOOZED_KEY = "langSuggestionSnoozed"
const FLAG_VALUE = "1"

function readFlag(storage: Storage, key: string): boolean {
  try {
    return storage.getItem(key) === FLAG_VALUE
  } catch {
    return false
  }
}

function writeFlag(storage: Storage, key: string): void {
  try {
    storage.setItem(key, FLAG_VALUE)
  } catch {
    // storage unavailable — nothing to persist, degrade silently
  }
}

/** True when the banner should stay hidden (permanent or this session). */
function isLanguageSuggestionDismissed(): boolean {
  return (
    readFlag(localStorage, DISMISSED_KEY) ||
    readFlag(sessionStorage, SNOOZED_KEY)
  )
}

/** Permanently suppress the banner — the user made a language decision. */
function dismissLanguageSuggestion(): void {
  writeFlag(localStorage, DISMISSED_KEY)
}

/** Hide the banner for this session only; it returns on the next visit. */
function snoozeLanguageSuggestion(): void {
  writeFlag(sessionStorage, SNOOZED_KEY)
}

export {
  dismissLanguageSuggestion,
  isLanguageSuggestionDismissed,
  snoozeLanguageSuggestion,
}
