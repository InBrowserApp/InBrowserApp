export type TransferStatus = "opening" | "failed" | undefined

export function receiveDatabase(
  onFile: (file: File) => void,
  onStatus: (status: TransferStatus) => void
) {
  const { hash, origin, pathname, search } = window.location
  const params = new URLSearchParams(hash.slice(1))
  const url = params.get("database")
  const name = params.get("name")
  if (!url?.startsWith(`blob:${origin}/`) || !name) return

  const controller = new AbortController()
  const { signal } = controller
  onStatus("opening")
  void (async () => {
    try {
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error("Database transfer failed")
      const blob = await response.blob()
      if (!signal.aborted) onFile(new File([blob], name, { type: blob.type }))
    } catch {
      if (!signal.aborted) onStatus("failed")
    } finally {
      if (!signal.aborted && window.location.hash === hash)
        window.history.replaceState(window.history.state, "", pathname + search)
    }
  })()
  return () => controller.abort()
}
