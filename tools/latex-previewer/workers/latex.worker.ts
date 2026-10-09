import init, { article_css, render } from "faster-latex/web"
import { decodeSource, failure } from "../core/source"
import { inspectStructure } from "../core/diagnostics"

export async function renderFile(file: File, send: (value: unknown) => void) {
  try {
    const source = decodeSource(new Uint8Array(await file.arrayBuffer()))
    send({ type: "source", source })
    await init()
    // Remove the engine's default document-node quota. Recursive macro guards
    // remain engine safety checks and produce visible resource-limit warnings.
    const result = render(source, { fullDocument: false, maxNodes: 0xffffffff })
    send({
      type: "result",
      html: result.html,
      css: article_css(),
      diagnostics: [
        ...result.warnings.map(({ line, message }) => ({ line, message })),
        ...inspectStructure(source),
      ],
    })
  } catch (error) {
    send({ type: "error", error: failure(error) })
  }
}

self.onmessage = (event: MessageEvent<File>) => {
  void renderFile(event.data, (value) => self.postMessage(value))
}
