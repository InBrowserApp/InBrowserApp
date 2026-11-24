import { sanitizeHar, type RedactionOptions } from "../core/sanitize"

export type SanitizeRequest = { file: File; options: RedactionOptions }
export type SanitizeResponse =
  | { status: "ready"; result: NonNullable<ReturnType<typeof sanitizeHar>> }
  | { status: "invalid" | "failed" }

self.onmessage = async ({ data }: MessageEvent<SanitizeRequest>) => {
  try {
    const result = sanitizeHar(await data.file.text(), data.options)
    self.postMessage(
      (result
        ? { status: "ready", result }
        : { status: "invalid" }) satisfies SanitizeResponse
    )
  } catch {
    self.postMessage({ status: "failed" } satisfies SanitizeResponse)
  }
}
