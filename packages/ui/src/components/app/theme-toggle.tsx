"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Moon, Sun, SunMoon } from "@workspace/ui/icons"

type ThemeOption = "light" | "dark" | "system"

type ThemeToggleProps = {
  labelLight: string
  labelDark: string
  labelSystem: string
  srLabel: string
}

function applyTheme(theme: ThemeOption) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList[isDark ? "add" : "remove"]("dark")
  document.documentElement.dataset.theme = theme
}

/**
 * Read the initial theme synchronously from the `data-theme` attribute
 * that the inline script in `<head>` already set before React hydrates.
 * This avoids a flash where the icon briefly shows the wrong state.
 */
function getInitialTheme(): ThemeOption {
  if (typeof document === "undefined") {
    return "system"
  }

  const attr = document.documentElement.dataset.theme

  if (attr === "light" || attr === "dark" || attr === "system") {
    return attr
  }

  return "system"
}

const themeIcon: Record<ThemeOption, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: SunMoon,
}

function ThemeToggle({
  labelLight,
  labelDark,
  labelSystem,
  srLabel,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeOption>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  // Listen to system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handler)

    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [theme])

  const TriggerIcon = themeIcon[theme]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <TriggerIcon className="size-4" />
          <span className="sr-only">{srLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemeOption)}
        >
          <DropdownMenuRadioItem value="light">
            <Sun />
            {labelLight}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon />
            {labelDark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <SunMoon />
            {labelSystem}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle }
