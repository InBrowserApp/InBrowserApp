import { getLanguageNativeName } from "@workspace/ui/lib/language-native-names"
import {
  dismissLanguageSuggestion,
  isLanguageSuggestionDismissed,
  snoozeLanguageSuggestion,
} from "@workspace/ui/lib/language-preference"
import { resolvePreferredLanguageCode } from "@workspace/ui/lib/resolve-preferred-language"

import { getSiteLanguageDirection } from "@/lib/site"

type PromptStrings = Readonly<{
  message: string
  action: string
  dismiss: string
  close: string
}>

const promptMessages = import.meta.glob<PromptStrings>("./messages/*.json", {
  eager: true,
  import: "default",
})

function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 })
    return () => window.cancelIdleCallback(handle)
  }

  const handle = window.setTimeout(callback, 0)
  return () => window.clearTimeout(handle)
}

function showLanguageSuggestion(): (() => void) | undefined {
  if (isLanguageSuggestionDismissed()) return

  const alternatives = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(
      'link[rel~="alternate"][hreflang]'
    )
  ).filter((link) => link.hreflang !== "x-default")
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  const preferred = resolvePreferredLanguageCode(
    alternatives.map((link) => link.hreflang),
    browserLanguages
  )
  if (!preferred || preferred === document.documentElement.lang) return

  const target = alternatives.find((link) => link.hreflang === preferred)!
  const strings = promptMessages[`./messages/${preferred}.json`]
  const template = document.querySelector<HTMLTemplateElement>(
    "#language-suggestion-template"
  )!
  const fragment = template.content.cloneNode(true) as DocumentFragment
  const content = fragment.querySelector<HTMLElement>("[data-content]")!
  const message = fragment.querySelector<HTMLElement>("[data-message]")!
  const closeButton = fragment.querySelector<HTMLButtonElement>("[data-close]")!
  const dismissButton =
    fragment.querySelector<HTMLButtonElement>("[data-dismiss]")!
  const switchLink = fragment.querySelector<HTMLAnchorElement>("[data-switch]")!
  const nativeName = getLanguageNativeName(preferred)

  content.lang = preferred
  content.dir = getSiteLanguageDirection(preferred)
  message.textContent = strings.message.replace("{language}", nativeName)
  closeButton.setAttribute("aria-label", strings.close)
  dismissButton.textContent = strings.dismiss
  switchLink.textContent = strings.action.replace("{language}", nativeName)
  // SEO alternates use production URLs; stay on the current preview/origin.
  switchLink.href = new URL(target.href).pathname
  switchLink.hreflang = preferred
  switchLink.lang = preferred

  function snooze() {
    snoozeLanguageSuggestion()
    cleanup()
  }

  closeButton.addEventListener("click", snooze)
  dismissButton.addEventListener("click", () => {
    dismissLanguageSuggestion()
    cleanup()
  })
  switchLink.addEventListener("click", snoozeLanguageSuggestion)
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") snooze()
  }
  document.addEventListener("keydown", onKeyDown)

  const banner = fragment.firstElementChild!
  document.body.append(fragment)

  function cleanup() {
    document.removeEventListener("keydown", onKeyDown)
    banner.remove()
  }

  return cleanup
}

function setupLanguageSuggestion(): () => void {
  let cleanup: (() => void) | undefined
  const cancelIdle = onIdle(() => {
    cleanup = showLanguageSuggestion()
  })

  return () => {
    cancelIdle()
    cleanup?.()
  }
}

export { setupLanguageSuggestion }
