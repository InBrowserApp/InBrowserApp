import { useEffect, useState } from "react"
import { failure } from "@workspace/legacy-doc/viewer/failure"
import type { Failure, Preview } from "@workspace/legacy-doc/viewer/types"
import type { preparePreview } from "@workspace/legacy-doc/viewer/preview"

export type LegacyWordPreviewMessages = Parameters<typeof preparePreview>[1]

type Status =
  | { file: File; loading: true }
  | { file: File; error: Failure }
  | { file: File; preview: Preview; template: boolean }

export function useLegacyWordPreview(
  file: File | null,
  messages: LegacyWordPreviewMessages
) {
  const [result, setResult] = useState<Status | null>(null)

  useEffect(() => {
    if (!file) {
      setResult(null)
      return
    }
    if (!file.size) {
      setResult({ file, error: "emptyFile" })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    setResult({ file, loading: true })
    void Promise.all([
      import("@workspace/legacy-doc/viewer/open-document"),
      import("@workspace/legacy-doc/viewer/preview"),
    ])
      .then(async ([{ openDocument }, { preparePreview }]) => {
        signal.throwIfAborted()
        const document = await openDocument(file, signal)
        signal.throwIfAborted()
        setResult({
          file,
          preview: preparePreview(document, messages),
          template: document.template,
        })
      })
      .catch((reason) => {
        if (!signal.aborted) setResult({ file, error: failure(reason) })
      })
    return () => controller.abort()
  }, [file, messages])

  if (result?.file !== file) return null
  return result
}
