// parse-torrent's queue-microtask dependency expects global outside a window.
Object.assign(globalThis, { global: globalThis })

self.addEventListener("message", async (event: MessageEvent<Blob>) => {
  try {
    const { readTorrent } = await import("./read-torrent")
    self.postMessage(await readTorrent(event.data))
  } catch {
    self.postMessage(null)
  }
})
