import viewerStylesUrl from "./viewer.css?url"

let stylesheet: { link: HTMLLinkElement; ready: Promise<void> } | undefined

export function loadViewerStyles(): Promise<void> {
  // A removed or failed link must be loaded again, even in the same document.
  if (stylesheet?.link.isConnected) return stylesheet.ready

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = viewerStylesUrl
  const ready = new Promise<void>((resolve, reject) => {
    link.onload = () => resolve()
    link.onerror = () => {
      link.remove()
      reject(new Error("Could not load PDF viewer styles."))
    }
  })
  stylesheet = { link, ready }
  document.head.append(link)
  return ready
}
