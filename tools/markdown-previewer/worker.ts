import { buildMarkdownPreview } from "@workspace/markdown"

self.onmessage = (
  event: MessageEvent<{ source: string; untitled: string; renderHtml: boolean }>
) => {
  try {
    self.postMessage({
      preview: buildMarkdownPreview(
        event.data.source,
        event.data.untitled,
        event.data.renderHtml
      ),
    })
  } catch {
    self.postMessage({ error: true })
  }
}
