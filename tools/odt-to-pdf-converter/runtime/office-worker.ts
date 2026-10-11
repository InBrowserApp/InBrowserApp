import { bootstrap, guard } from "@workspace/libreoffice/scripts"
import { loadAssets } from "@workspace/libreoffice/load-assets"
import { checkImages } from "../core/images"
import { preflight } from "../core/preflight"
import { validatePdf } from "../core/validate-pdf"
import { failure } from "../core/errors"
import type { Reply } from "./types"

self.onmessage = async ({ data: input }: MessageEvent<ArrayBuffer>) => {
  let engine: Worker | undefined
  let finished = false
  let loading = false
  let url: string | undefined
  const close = () => {
    finished = true
    engine?.terminate()
    if (url) URL.revokeObjectURL(url)
  }
  const fail = (error: unknown) => {
    if (finished) return
    self.postMessage({
      type: "error",
      code:
        loading && failure(error).code !== "resource"
          ? "engineUnavailable"
          : failure(error).code,
    } satisfies Reply)
    close()
  }
  try {
    const { images } = preflight(input)
    await checkImages(images)
    self.postMessage({
      type: "progress",
      stage: "engineLoading",
    } satisfies Reply)
    loading = true
    const assets = await loadAssets()
    loading = false
    url = URL.createObjectURL(
      new Blob([guard, "\n", bootstrap], { type: "text/javascript" })
    )
    engine = new Worker(url)
    engine.onmessage = async ({
      data,
    }: MessageEvent<Reply & { documentResourceBlocked?: boolean }>) => {
      if (finished) return
      if (data.documentResourceBlocked) {
        self.postMessage({ type: "error", code: "unsupported" } satisfies Reply)
        close()
      } else if (data.type === "result") {
        try {
          self.postMessage({
            type: "progress",
            stage: "saving",
          } satisfies Reply)
          await validatePdf(data.bytes, data.pages, data.dimensions)
          if (finished) return
          self.postMessage(data, { transfer: [data.bytes] })
          close()
        } catch (error) {
          fail(error)
        }
      } else {
        self.postMessage(data)
        if (data.type === "error") close()
      }
    }
    engine.onerror = () => {
      self.postMessage({
        type: "error",
        code: "engineUnavailable",
      } satisfies Reply)
      close()
    }
    engine.postMessage({ input, assets, guard, format: "writer" }, [
      input,
      assets.binary,
      assets.archive,
      ...assets.fonts,
    ])
  } catch (error) {
    fail(error)
  }
}
