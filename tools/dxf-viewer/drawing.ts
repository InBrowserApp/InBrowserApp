import { dxfEncoding } from "@workspace/dxf-drawing/encoding"
import { drawingFonts } from "@workspace/dxf-drawing/fonts"
import type { DxfViewer as Viewer } from "dxf-viewer"

export type Drawing = {
  viewer: Viewer
  show: () => void
  dispose: () => void
}

export function fitDrawing(viewer: Viewer) {
  const bounds = viewer.GetBounds()
  const origin = viewer.GetOrigin()
  if (!bounds) return
  viewer.FitView(
    bounds.minX - origin.x,
    bounds.maxX - origin.x,
    bounds.minY - origin.y,
    bounds.maxY - origin.y
  )
  viewer.Render()
}

export function adjustDrawing(viewer: Viewer, x: number, y: number, zoom = 1) {
  const camera = viewer.GetCamera()
  const width = (camera.right - camera.left) / camera.zoom
  const center = camera.position.clone()
  center.x += x * width
  center.y += (y * (camera.top - camera.bottom)) / camera.zoom
  viewer.SetView(center, width * zoom)
  viewer.Render()
}

export async function openDrawing(
  file: File,
  stage: HTMLElement,
  lang: string,
  signal: AbortSignal
): Promise<Drawing> {
  const header = await file.slice(0, 65536).text()
  const encoding = dxfEncoding(header)
  const [{ DxfViewer }, fonts] = await Promise.all([
    import("dxf-viewer"),
    drawingFonts(lang),
  ])
  signal.throwIfAborted()
  const host = document.createElement("div")
  host.className = "absolute inset-0 overflow-hidden"
  host.style.visibility = "hidden"
  stage.append(host)
  let viewer: Viewer
  try {
    viewer = new DxfViewer(host, {
      autoResize: true,
      antialias: true,
      colorCorrection: true,
      fileEncoding: encoding,
      sceneOptions: { suppressPaperSpace: true },
    })
    if (!viewer.HasRenderer()) throw new Error("WebGL unavailable")
    // Auto-resize sets inline positioning. Keep the host stretched over the stage.
    host.style.removeProperty("position")
  } catch {
    host.remove()
    throw new Error("Could not start DXF renderer", { cause: "webgl" })
  }

  function applyTheme() {
    viewer.SetClearColor(
      document.documentElement.classList.contains("dark") ? 0x202127 : 0xf9fafb
    )
  }
  const theme = new MutationObserver(applyTheme)
  let disposed = false
  function dispose() {
    if (disposed) return
    disposed = true
    const renderer = viewer.GetRenderer()
    theme.disconnect()
    viewer.Destroy()
    renderer?.forceContextLoss()
    host.remove()
  }

  const url = URL.createObjectURL(file)
  // Destroying the viewer terminates its worker without settling a pending Load.
  let cancel!: () => void
  const aborted = new Promise<never>((_, reject) => {
    cancel = () => reject(signal.reason)
  })
  signal.addEventListener("abort", cancel, { once: true })
  try {
    viewer.GetCanvas().setAttribute("aria-hidden", "true")
    viewer.GetCanvas().style.touchAction = "none"
    applyTheme()
    await Promise.race([
      viewer.Load({
        url,
        fonts,
        workerFactory: () =>
          new Worker(new URL("./dxf.worker.ts", import.meta.url), {
            type: "module",
          }),
      }),
      aborted,
    ])
    signal.throwIfAborted()
    if (!viewer.GetBounds()) throw new Error("Empty DXF", { cause: "empty" })
    theme.observe(document.documentElement, { attributeFilter: ["class"] })
    return {
      viewer,
      show: () => {
        host.style.visibility = ""
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  } finally {
    signal.removeEventListener("abort", cancel)
    URL.revokeObjectURL(url)
  }
}
