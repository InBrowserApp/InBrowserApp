import { useEffect, useState } from "react"
import { STORAGE_KEYS } from "./constants"
import type { PreviewTheme } from "./types"

export function usePreferences() {
  const [theme, setTheme] = useState<PreviewTheme>("clean")
  const [outline, setOutline] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      setTheme(
        localStorage.getItem(STORAGE_KEYS.previewTheme) === "slate"
          ? "slate"
          : "clean"
      )
      setOutline(localStorage.getItem(STORAGE_KEYS.showOutline) === "true")
    } catch {
      /* Reading preferences remain usable without storage. */
    }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEYS.previewTheme, theme)
      localStorage.setItem(STORAGE_KEYS.showOutline, String(outline))
    } catch {
      /* Document storage errors are reported by useDocument. */
    }
  }, [ready, theme, outline])
  return { theme, setTheme, outline, setOutline }
}
