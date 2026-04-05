"use client"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

function LanguageSwitcher({ label, options }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Languages className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem key={option.code} asChild>
            <a href={option.href} hrefLang={option.code} lang={option.code}>
              {option.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSwitcher }
export type { LanguageOption }
