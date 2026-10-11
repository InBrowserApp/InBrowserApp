import { isIsolatedToolPath } from "./browser-isolation"

// Apply before Astro installs hover prefetch listeners. Isolated documents
// require a full navigation; prefetching across that boundary can fail in WebKit.
export function setupIsolationLinks() {
  const previous = new WeakMap<HTMLAnchorElement, (string | null)[]>()
  const attributes = ["data-astro-prefetch", "data-astro-reload"]
  function isolatedDestination(href: string) {
    try {
      const target = new URL(href, location.href)
      return (
        target.origin === location.origin && isIsolatedToolPath(target.pathname)
      )
    } catch {
      return false
    }
  }
  function configure(anchor: HTMLAnchorElement) {
    const isolated =
      isIsolatedToolPath(location.pathname) || isolatedDestination(anchor.href)
    if (isolated) {
      if (!previous.has(anchor))
        previous.set(
          anchor,
          attributes.map((name) => anchor.getAttribute(name))
        )
      anchor.setAttribute("data-astro-prefetch", "false")
      anchor.setAttribute("data-astro-reload", "")
    } else {
      const values = previous.get(anchor)
      if (!values) return
      attributes.forEach((name, index) => {
        const value = values[index]
        if (value == null) anchor.removeAttribute(name)
        else anchor.setAttribute(name, value)
      })
      previous.delete(anchor)
    }
  }
  function scan(node: Element) {
    if (node instanceof HTMLAnchorElement && node.hasAttribute("href"))
      configure(node)
    node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(configure)
  }
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (record.target instanceof HTMLAnchorElement) configure(record.target)
      } else {
        for (const node of record.addedNodes)
          if (node instanceof Element) scan(node)
      }
    }
  })
  function refresh() {
    observer.disconnect()
    scan(document.body)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["href"],
    })
  }
  refresh()
  document.addEventListener("astro:after-swap", refresh)
  return () => {
    observer.disconnect()
    document.removeEventListener("astro:after-swap", refresh)
  }
}
