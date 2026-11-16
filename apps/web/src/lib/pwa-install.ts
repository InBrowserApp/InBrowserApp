interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<unknown>
}

export function setupPwaInstall() {
  let installPrompt: BeforeInstallPromptEvent | null = null

  function refresh() {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    document
      .querySelectorAll<HTMLButtonElement>("[data-pwa-install]")
      .forEach((button) => {
        button.hidden = !installPrompt || standalone
      })
  }

  function beforeInstall(event: Event) {
    event.preventDefault()
    installPrompt = event as BeforeInstallPromptEvent
    refresh()
  }

  function installed() {
    installPrompt = null
    refresh()
  }

  async function install(event: MouseEvent) {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest<HTMLButtonElement>("[data-pwa-install]")
    if (!button || button.hidden || !installPrompt) return

    // Browsers allow each prompt to be used only once, including on dismissal.
    const prompt = installPrompt
    installPrompt = null
    refresh()
    try {
      await prompt.prompt()
    } catch {
      // Keep the action hidden until the browser supplies a fresh prompt.
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
