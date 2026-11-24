import url from "./fixtures/putty.chm?url"

export async function loadSample(signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error("Could not load sample")
  return new File([await response.blob()], "putty.chm")
}
