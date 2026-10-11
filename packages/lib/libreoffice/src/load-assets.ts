import { files } from "./assets"

async function read(url: string) {
  const response = await fetch(url, { credentials: "omit", redirect: "error" })
  if (!response.ok) throw new Error("Asset unavailable")
  return response.arrayBuffer()
}

async function inflate(urls: string[]) {
  const parts = await Promise.all(urls.map(read))
  const stream = new Blob(parts)
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
  return new Response(stream).arrayBuffer()
}

export async function loadAssets() {
  const [binary, archive, ...fonts] = await Promise.all([
    inflate(files.wasm),
    inflate(files.data),
    read(files.cjk),
    read(files.thai),
    read(files.devanagari),
  ])
  return {
    engine: new URL(files.engine, location.href).href,
    binary,
    archive,
    fonts,
  }
}
