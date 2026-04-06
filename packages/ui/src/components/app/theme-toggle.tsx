"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
}

function getStoredTheme(): ThemeOption {
  if (typeof localStorage === "undefined") {
    return "system"
  }

  const stored = localStorage.getItem("theme")

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored
  }

  return "system"
}

function ThemeToggle({
  labelLight,
  labelDark,
  labelSystem,
  srLabel,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeOption>("system")

  useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

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
          {theme === "light" ? (
            <Sun className="size-4" />
          ) : theme === "dark" ? (
            <Moon className="size-4" />
          ) : (
            <SunMoon className="size-4" />
          )}
          <span className="sr-only">{srLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun />
          {labelLight}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon />
          {labelDark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <SunMoon />
          {labelSystem}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle }
