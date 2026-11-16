export async function loadWasmSource(url: string) {
  const response = await fetch(url)
  if (!response.ok || !response.body) throw new Error("WASM download failed")
  return new Response(
    response.body.pipeThrough(new DecompressionStream("gzip")),
    { headers: { "Content-Type": "application/wasm" } }
  )
}
