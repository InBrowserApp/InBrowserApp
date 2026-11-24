import { readTorrent } from "./read-torrent"

self.addEventListener("message", (event: MessageEvent<Blob>) => {
  void readTorrent(event.data).then(
    (result) => self.postMessage(result),
    () => self.postMessage(null)
  )
})
