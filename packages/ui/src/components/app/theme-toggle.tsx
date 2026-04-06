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

/**
 * The trigger renders all three icons and uses pure CSS to show the
 * correct one based on the `data-theme` attribute that the inline
 * `<script>` in `<head>` sets before first paint.  This means there
 * is zero flash even though Astro SSG pre-renders static HTML with
 * all three icons present.
 */
function ThemeToggleTriggerIcons() {
  return (
    <>
      <Sun className="hidden size-4 [[data-theme=light]_&]:block" />
      <Moon className="hidden size-4 [[data-theme=dark]_&]:block" />
      <SunMoon className="hidden size-4 [[data-theme=system]_&]:block" />
    </>
  )
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <ThemeToggleTriggerIcons />
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
