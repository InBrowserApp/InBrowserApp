"use client"

import { useMemo } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Check, Languages } from "@workspace/ui/icons"
import { getLanguageNativeName } from "@workspace/ui/lib/language-native-names"
import { snoozeLanguageSuggestion } from "@workspace/ui/lib/language-preference"
import { resolvePreferredLanguageCode } from "@workspace/ui/lib/resolve-preferred-language"

type LanguageOption = Readonly<{
  code: string
  href: string
  label?: string
  current?: boolean
}>

function getLanguageLabel(option: LanguageOption) {
  return option.label ?? getLanguageNativeName(option.code)
}

type LanguageSwitcherProps = {
  label: string
  options: readonly LanguageOption[]
}

/**
 * Sort options so the current language comes first, then the user's
 * preferred browser language (if different), then the rest unchanged.
 * The preferred language is resolved with the same matcher the
 * suggestion banner uses, so the two never disagree.
 */
function useSortedOptions(options: readonly LanguageOption[]) {
  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return options
    }

    const browserLangs = navigator.languages ?? [navigator.language]
    const preferred = resolvePreferredLanguageCode(
      options.map((option) => option.code),
      browserLangs
    )

    return [...options].sort((a, b) => {
      if (a.current) return -1
      if (b.current) return 1
      if (a.code === preferred) return -1
      if (b.code === preferred) return 1
      return 0
    })
  }, [options])
}

function LanguageSwitcher({ label, options }: LanguageSwitcherProps) {
  const sortedOptions = useSortedOptions(options)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Languages className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortedOptions.map((option) => (
          <DropdownMenuItem key={option.code} asChild className="relative pr-8">
            <a
              href={option.href}
              hrefLang={option.code}
              lang={option.code}
              onClick={() => snoozeLanguageSuggestion()}
            >
              {getLanguageLabel(option)}
              {option.current ? (
                <span className="pointer-events-none absolute right-2 flex items-center justify-center">
                  <Check className="size-4" />
                </span>
              ) : null}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSwitcher }
export type { LanguageOption }
