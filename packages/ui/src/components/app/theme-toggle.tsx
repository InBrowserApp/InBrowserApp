"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Monitor, Moon, Sun } from "@workspace/ui/icons"

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
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
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
          <Monitor />
          {labelSystem}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle }
