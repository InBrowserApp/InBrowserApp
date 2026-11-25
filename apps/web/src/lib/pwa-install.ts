import { getInstallTarget } from "./install-target"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<unknown>
}

const installLinkSelector = "a[data-pwa-install-trigger]"

export function setupPwaInstall() {
  let installPrompt: BeforeInstallPromptEvent | null = null
  const guide = getInstallTarget(navigator)

  if (guide) {
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      installLinkSelector
    )) {
      const href = link.getAttribute("href")
      if (href?.endsWith("/install/")) link.href = `${href}${guide}/`
    }
  }

  function beforeInstall(event: Event) {
    event.preventDefault()
    installPrompt = event as BeforeInstallPromptEvent
  }

  function installed() {
    installPrompt = null
  }

  async function install(event: MouseEvent) {
    if (
      !installPrompt ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !(event.target instanceof Element)
    )
      return

    const link = event.target.closest<HTMLAnchorElement>(installLinkSelector)
    if (!link || window.matchMedia("(display-mode: standalone)").matches) return

    event.preventDefault()
    const prompt = installPrompt
    installPrompt = null

    try {
      await prompt.prompt()
    } catch {
      window.location.assign(link.href)
    }
  }

  window.addEventListener("beforeinstallprompt", beforeInstall)
  window.addEventListener("appinstalled", installed)
  document.addEventListener("click", install)

  return () => {
    window.removeEventListener("beforeinstallprompt", beforeInstall)
    window.removeEventListener("appinstalled", installed)
    document.removeEventListener("click", install)
  }
}
