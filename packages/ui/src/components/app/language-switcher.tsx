"use client"

import { useMemo } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Languages } from "@workspace/ui/icons"

type LanguageOption = Readonly<{
  code: string
  href: string
  label: string
  current?: boolean
}>

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
  const currentCode = options.find((o) => o.current)?.code ?? ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Languages className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={currentCode}>
          {sortedOptions.map((option) => (
            <DropdownMenuRadioItem
              key={option.code}
              value={option.code}
              onSelect={() => {
                window.location.href = option.href
              }}
            >
              <span lang={option.code}>{option.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSwitcher }
export type { LanguageOption }
