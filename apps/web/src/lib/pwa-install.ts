interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<unknown>
}

export function setupPwaInstall() {
  let installPrompt: BeforeInstallPromptEvent | null = null
  let offered = false

  function refresh() {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    document
      .querySelectorAll<HTMLElement>("[data-pwa-install]")
      .forEach((control) => {
        control.hidden = !offered || standalone
        control
          .querySelector("[data-pwa-install-trigger]")
          ?.setAttribute("aria-disabled", String(!installPrompt))
      })
  }

  function beforeInstall(event: Event) {
    event.preventDefault()
    installPrompt = event as BeforeInstallPromptEvent
    offered = true
    refresh()
  }

  function installed() {
    installPrompt = null
    offered = false
    refresh()
  }

  async function install(event: MouseEvent) {
    if (!(event.target instanceof Element)) return
    const trigger = event.target.closest<HTMLElement>(
      "[data-pwa-install-trigger]"
    )
    if (!trigger) return
    // The summary is an install action; do not toggle a disclosure on click.
    event.preventDefault()
    if (
      trigger.closest<HTMLElement>("[data-pwa-install]")?.hidden ||
      !installPrompt
    )
      return

    // Browsers allow each prompt to be used only once, including on dismissal.
    const prompt = installPrompt
    installPrompt = null
    refresh()
    try {
      await prompt.prompt()
    } catch {
      // Keep the icon visible, awaiting a fresh one-use prompt from the browser.
    }
  }

  window.addEventListener("beforeinstallprompt", beforeInstall)
  window.addEventListener("appinstalled", installed)
  document.addEventListener("click", install)
  document.addEventListener("astro:after-swap", refresh)

  return () => {
    window.removeEventListener("beforeinstallprompt", beforeInstall)
    window.removeEventListener("appinstalled", installed)
    document.removeEventListener("click", install)
    document.removeEventListener("astro:after-swap", refresh)
  }
}
