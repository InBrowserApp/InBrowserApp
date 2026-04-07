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

type LanguageOption = Readonly<{
  code: string
  href: string
  label?: string
  current?: boolean
}>

const LANGUAGE_NATIVE_NAMES: Readonly<Record<string, string>> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "zh-HK": "繁體中文（香港）",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
  pt: "Português",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  nl: "Nederlands",
  sv: "Svenska",
  pl: "Polski",
  vi: "Tiếng Việt",
  th: "ไทย",
  id: "Bahasa Indonesia",
  he: "עברית",
  ms: "Bahasa Melayu",
  no: "Norsk",
  fa: "فارسی",
  ur: "اردو",
}

function getLanguageLabel(option: LanguageOption) {
  return option.label ?? LANGUAGE_NATIVE_NAMES[option.code] ?? option.code
}

type LanguageSwitcherProps = {
  label: string
  options: readonly LanguageOption[]
}

/**
 * Sort options so the current language comes first, then the user's
 * preferred browser language (if different), then the rest unchanged.
 */
function useSortedOptions(options: readonly LanguageOption[]) {
  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return options
    }

    const browserLangs = navigator.languages ?? [navigator.language]
    const sorted = [...options]

    sorted.sort((a, b) => {
      // Current language always first
      if (a.current) return -1
      if (b.current) return 1

      // Then prioritise by browser language preference
      const aIdx = browserLangs.findIndex(
        (l) =>
          l === a.code ||
          l.startsWith(`${a.code}-`) ||
          a.code.startsWith(`${l}-`) ||
          l.split("-")[0] === a.code.split("-")[0]
      )
      const bIdx = browserLangs.findIndex(
        (l) =>
          l === b.code ||
          l.startsWith(`${b.code}-`) ||
          b.code.startsWith(`${l}-`) ||
          l.split("-")[0] === b.code.split("-")[0]
      )
      const aPrio = aIdx === -1 ? Infinity : aIdx
      const bPrio = bIdx === -1 ? Infinity : bIdx

      return aPrio - bPrio
    })

    return sorted
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
            <a href={option.href} hrefLang={option.code} lang={option.code}>
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
