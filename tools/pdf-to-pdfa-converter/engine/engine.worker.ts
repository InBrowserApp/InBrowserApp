// oxlint-disable-next-line import/default -- Vite creates default exports for asset URLs.
import loaderUrl from "./generated/fynepdf.mjs?url"
// oxlint-disable-next-line import/default -- The compressed file is a static asset.
import wasmUrl from "./generated/fynepdf.bin?url"
import type { EngineRequest, EngineResult, Profile } from "./protocol"

type Report = {
  ok: boolean
  conforms: boolean
  error?: string
  problems: string[]
  changes: Record<string, number>
}

const fontEncodingRepairs = [
  "fonts-substituted",
  "font-encodings",
  "font-cmaps",
  "cmaps-embedded",
  "cmaps-merged",
]

type Engine = {
  FS: {
    writeFile: (path: string, bytes: Uint8Array) => void
    readFile: (path: string) => Uint8Array<ArrayBuffer>
  }
  ccall: (
    name: "convert_pdfa",
    result: "string",
    types: ["number"],
    args: [Profile]
  ) => string
}

async function convert({
  bytes,
  profile,
}: EngineRequest): Promise<EngineResult> {
  const response = await fetch(wasmUrl)
  if (!response.ok || !response.body) return { status: "failed" }

  const [wasmBinary, { default: load }] = await Promise.all([
    new Response(
      response.body.pipeThrough(new DecompressionStream("gzip"))
    ).arrayBuffer(),
    import(/* @vite-ignore */ loaderUrl) as Promise<{
      default: (options: { wasmBinary: ArrayBuffer }) => Promise<Engine>
    }>,
  ])
  const engine = await load({ wasmBinary })
  engine.FS.writeFile("/input.pdf", new Uint8Array(bytes))
  const report: Report = JSON.parse(
    engine.ccall("convert_pdfa", "string", ["number"], [profile])
  )
  if (!report.ok) {
    if (report.error === "password") return { status: "encrypted" }
    return { status: report.error === "unreadable" ? "invalid" : "failed" }
  }
  if (!report.conforms) {
    return {
      status: report.problems.includes("transparency")
        ? "transparency"
        : "checkFailed",
    }
  }
  return {
    status: "ready",
    bytes: engine.FS.readFile("/output.pdf").buffer,
    fontEncodingChanged: fontEncodingRepairs.some((key) => report.changes[key]),
  }
}

self.onmessage = async ({ data }: MessageEvent<EngineRequest>) => {
  try {
    const result = await convert(data)
    if (result.status === "ready")
      self.postMessage(result, { transfer: [result.bytes] })
    else self.postMessage(result)
  } catch {
    self.postMessage({ status: "failed" } satisfies EngineResult)
  }
}
