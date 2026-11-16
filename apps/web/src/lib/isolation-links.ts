import { isIsolatedToolPath } from "./browser-isolation"

// Apply before Astro installs hover prefetch listeners. Speculative loading
// across the COOP/COEP boundary can fail in WebKit.
export function setupIsolationLinks() {
  const previous = new WeakMap<HTMLAnchorElement, string | null>()
  const attribute = "data-astro-prefetch"
  const isolatedDocument = isIsolatedToolPath(location.pathname)
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
    const isolated = isolatedDocument || isolatedDestination(anchor.href)
    if (isolated) {
      if (!previous.has(anchor))
        previous.set(anchor, anchor.getAttribute(attribute))
      anchor.setAttribute(attribute, "false")
    } else if (previous.has(anchor)) {
      const value = previous.get(anchor)
      if (value == null) anchor.removeAttribute(attribute)
      else anchor.setAttribute(attribute, value)
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
  scan(document.body)
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href"],
  })
  return () => observer.disconnect()
}
