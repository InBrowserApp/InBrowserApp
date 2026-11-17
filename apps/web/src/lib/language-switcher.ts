import { snoozeLanguageSuggestion } from "@workspace/ui/lib/language-preference"
import { resolvePreferredLanguageCode } from "@workspace/ui/lib/resolve-preferred-language"

export function setupLanguageSwitcher(container: HTMLElement) {
  const links = [
    ...container.querySelectorAll<HTMLAnchorElement>("a[hreflang]"),
  ]
  const preferred = resolvePreferredLanguageCode(
    links.map((link) => link.hreflang),
    navigator.languages?.length ? navigator.languages : [navigator.language]
  )
  const currentLink = links.find((link) => link.hasAttribute("aria-current"))
  const preferredLink = links.find((link) => link.hreflang === preferred)
  if (preferredLink && preferredLink !== currentLink) {
    if (currentLink) currentLink.after(preferredLink)
    else container.prepend(preferredLink)
  }

  function syncLocationSuffix() {
    for (const link of links) {
      link.setAttribute(
        "href",
        link.pathname + window.location.search + window.location.hash
      )
    }
  }

  const details = container.closest("details")
  syncLocationSuffix()
  details?.addEventListener("toggle", syncLocationSuffix)
  container.addEventListener("click", snoozeLanguageSuggestion)

  return () => {
    details?.removeEventListener("toggle", syncLocationSuffix)
    container.removeEventListener("click", snoozeLanguageSuggestion)
  }
}
