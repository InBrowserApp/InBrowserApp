type Theme = "light" | "dark" | "system"

function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

export function setupThemeControls() {
  const media = window.matchMedia("(prefers-color-scheme: dark)")

  function applyTheme() {
    const value = document.documentElement.dataset.theme
    const theme = isTheme(value) ? value : "system"
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark" || (theme === "system" && media.matches)
    )
    document
      .querySelectorAll<HTMLButtonElement>("[data-theme-option]")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.themeOption === theme)
        )
      })
  }

  function onClick(event: MouseEvent) {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest<HTMLButtonElement>(
      "button[data-theme-option]"
    )
    const theme = button?.dataset.themeOption
    if (!isTheme(theme)) return

    document.documentElement.dataset.theme = theme
    applyTheme()
    try {
      localStorage.setItem("theme", theme)
    } catch {
      // Keep the current page usable when browser storage is disabled.
    }
  }

  applyTheme()
  document.addEventListener("click", onClick)
  document.addEventListener("astro:page-load", applyTheme)
  media.addEventListener("change", applyTheme)

  return () => {
    document.removeEventListener("click", onClick)
    document.removeEventListener("astro:page-load", applyTheme)
    media.removeEventListener("change", applyTheme)
  }
}
