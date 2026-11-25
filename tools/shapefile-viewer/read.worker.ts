import { readShapefiles } from "./read"

async function example() {
  const response = await fetch(new URL("./bay-example.zip", import.meta.url))
  if (!response.ok) throw new Error("Sample is unavailable")
  return [{ name: "bay-example.zip", bytes: await response.arrayBuffer() }]
}

self.onmessage = async ({ data }: MessageEvent<File[] | "example">) => {
  try {
    const inputs =
      data === "example"
        ? await example()
        : await Promise.all(
            data.map(async (file) => ({
              name: file.name,
              bytes: await file.arrayBuffer(),
            }))
          )
    self.postMessage(readShapefiles(inputs))
  } catch {
    self.postMessage(null)
  }
}
