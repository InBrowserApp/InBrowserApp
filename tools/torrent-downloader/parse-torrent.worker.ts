// parse-torrent's queue-microtask dependency expects global outside a window.
Object.assign(globalThis, { global: globalThis })

self.addEventListener("message", async (event: MessageEvent<File>) => {
  try {
    const { default: parseTorrent } = await import("parse-torrent")
    const parsed = await parseTorrent(
      new Uint8Array(await event.data.arrayBuffer())
    )
    self.postMessage(parsed.files ? parsed : null)
  } catch {
    self.postMessage(null)
  }
})
