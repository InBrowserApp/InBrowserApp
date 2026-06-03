"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { X } from "@workspace/ui/icons"
import { getLanguageNativeName } from "@workspace/ui/lib/language-native-names"
import {
  dismissLanguageSuggestion,
  isLanguageSuggestionDismissed,
  snoozeLanguageSuggestion,
} from "@workspace/ui/lib/language-preference"
import { resolvePreferredLanguageCode } from "@workspace/ui/lib/resolve-preferred-language"

import { getSiteLanguageDirection } from "@/lib/site"

type LanguageOption = Readonly<{
  code: string
  href: string
  current?: boolean
}>

type PromptStrings = Readonly<{
  message: string
  action: string
  dismiss: string
  close: string
}>

type LanguageSuggestionProps = {
  options: readonly LanguageOption[]
  currentLanguage: string
}

const promptMessages = import.meta.glob("./messages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PromptStrings>

function getPromptStrings(code: string): PromptStrings | undefined {
  return promptMessages[`./messages/${code}.json`]
}

function interpolate(template: string, language: string): string {
  return template.replace("{language}", language)
}

/**
 * Run a callback when the browser is idle, falling back to a microtask
 * when `requestIdleCallback` is unavailable (Safari, test environments).
 * Returns a cleanup function.
 */
function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback)
    return () => window.cancelIdleCallback(handle)
  }

  const handle = window.setTimeout(callback, 0)
  return () => window.clearTimeout(handle)
}

function detectSuggestion(
  options: readonly LanguageOption[],
  currentLanguage: string
): LanguageOption | null {
  if (isLanguageSuggestionDismissed()) {
    return null
  }

  const browserLanguages = navigator.languages ?? [navigator.language]
  const preferred = resolvePreferredLanguageCode(
    options.map((option) => option.code),
    browserLanguages
  )

  if (!preferred || preferred === currentLanguage) {
    return null
  }

  const target = options.find((option) => option.code === preferred)

  return target && getPromptStrings(target.code) ? target : null
}

/**
 * Client-only banner that suggests switching to the visitor's preferred
 * language when it differs from the current page's language.
 *
 * Rendered with `client:only` — it never appears in the prerendered HTML,
 * so crawlers see clean single-language pages and there is no automatic
 * redirect, no cloaking, and no layout shift (it is a fixed-position
 * toast). Detection runs on idle and is suppressed once the user has made
 * any language decision (see `language-preference`).
 */
function LanguageSuggestion({
  options,
  currentLanguage,
}: LanguageSuggestionProps) {
  const [target, setTarget] = useState<LanguageOption | null>(null)

  useEffect(() => {
    return onIdle(() => {
      setTarget(detectSuggestion(options, currentLanguage))
    })
  }, [options, currentLanguage])

  // "No thanks" / switching language is a permanent decision.
  function dismiss() {
    dismissLanguageSuggestion()
    setTarget(null)
  }

  // The "✕" icon and Escape only close for this session; the banner
  // returns on the visitor's next visit.
  function snooze() {
    snoozeLanguageSuggestion()
    setTarget(null)
  }

  useEffect(() => {
    if (!target) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        snooze()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [target])

  if (!target) {
    return null
  }

  const strings = getPromptStrings(target.code)
  if (!strings) {
    return null
  }

  const nativeName = getLanguageNativeName(target.code)

  return (
    <div
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 max-w-[min(20rem,calc(100vw-2rem))] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex flex-col gap-3 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg"
        lang={target.code}
        dir={getSiteLanguageDirection(target.code)}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">
            {interpolate(strings.message, nativeName)}
          </p>
          <button
            type="button"
            className="-m-1 shrink-0 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
            onClick={snooze}
            aria-label={strings.close}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={dismiss}>
            {strings.dismiss}
          </Button>
          <Button asChild size="sm">
            <a
              href={target.href}
              hrefLang={target.code}
              lang={target.code}
              onClick={() => dismissLanguageSuggestion()}
            >
              {interpolate(strings.action, nativeName)}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export { LanguageSuggestion }
