// Vite provides the default URL export for the standalone renderer bundle.
// oxlint-disable-next-line import/default
import frameUrl from "./frame.ts?worker&url"
import type { Source, Progress, Result, Reply } from "./types"

export type { Source, Progress, Result }

/** A disposable browsing context owns pagination, canvas and PDF resources. */
export async function renderPdf(
  source: Source,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<Result> {
  signal.throwIfAborted()
  const frame = document.createElement("iframe")
  frame.setAttribute("aria-hidden", "true")
  frame.tabIndex = -1
  frame.sandbox.add("allow-scripts", "allow-same-origin")
  frame.style.cssText =
    "position:fixed;left:-100000px;top:0;width:794px;height:1123px;border:0;pointer-events:none"
  const token = crypto.randomUUID()
  // Vite's worker URL build emits an isolated bundle. The trusted module runs
  // inside a Window, where the pagination libraries can use the DOM.
  const url = JSON.stringify(new URL(frameUrl, location.href).href).replace(
    /</g,
    "\\u003c"
  )
  // Serialize only trusted bootstrap values. DOM serialization hides nonce
  // attributes; the document HTML itself arrives later as a message payload.
  // WebKit suspends animation frames in offscreen iframes. This private
  // renderer needs cooperative scheduling, without waiting for screen paint.
  const scheduler = `window.requestAnimationFrame = callback => setTimeout(() => callback(performance.now()), 0); window.cancelAnimationFrame = clearTimeout; window.requestIdleCallback = callback => setTimeout(() => callback({didTimeout:false,timeRemaining:()=>50}), 0); window.cancelIdleCallback = clearTimeout;`
  frame.srcdoc = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'nonce-${token}'; style-src 'unsafe-inline'; img-src data:; connect-src 'self'; base-uri 'none'; form-action 'none'"></head><body><script type="module" nonce="${token}">${scheduler} try { await import(${url}) } catch { parent.postMessage({error:"engineUnavailable",page:0,token:"${token}"},parent.location.origin) }</script></body></html>`
  try {
    return await new Promise<Result>((resolve, reject) => {
      const abort = () => finish(() => reject(signal.reason))
      const receive = (event: MessageEvent<Reply & { token?: string }>) => {
        if (event.source !== frame.contentWindow) return
        const data = event.data
        if ("ready" in data) {
          frame.contentWindow!.postMessage({ source, token }, location.origin)
        } else if (data.token === token) {
          if ("progress" in data) progress(data.progress)
          if ("result" in data) finish(() => resolve(data.result))
          if ("error" in data)
            finish(() =>
              reject(Object.assign(new Error(data.error), { page: data.page }))
            )
        }
      }
      const finish = (done: () => void) => {
        signal.removeEventListener("abort", abort)
        window.removeEventListener("message", receive)
        done()
      }
      signal.addEventListener("abort", abort, { once: true })
      window.addEventListener("message", receive)
      frame.onerror = () => finish(() => reject(new Error("engineUnavailable")))
      document.body.append(frame)
    })
  } finally {
    frame.remove()
  }
}
