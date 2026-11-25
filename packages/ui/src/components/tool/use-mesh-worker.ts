import { useEffect, useRef, useState } from "react"
import { exampleFile } from "./model-viewer/load-model"
import type { MeshFormat } from "@workspace/model-mesh/mesh-file"

type Request = { worker?: Worker }

export function useMeshWorker<Output>(
  sampleFormat: MeshFormat,
  createWorker: () => Worker,
  buildMessage: (file: File) => unknown = (file) => file
) {
  type Result = { name: string; data: Output }
  const active = useRef<Request>(null)
  const [status, setStatus] = useState<"working" | "failed">()
  const [result, setResult] = useState<Result>()

  useEffect(
    () => () => {
      active.current?.worker?.terminate()
      active.current = null
    },
    []
  )

  async function run(supplied?: File) {
    active.current?.worker?.terminate()
    const request: Request = {}
    active.current = request
    setStatus("working")

    function finish(output?: Result) {
      if (active.current !== request) return
      request.worker?.terminate()
      active.current = null
      if (output) setResult(output)
      setStatus(output ? undefined : "failed")
    }

    try {
      const file = supplied ?? (await exampleFile(sampleFormat))
      if (active.current !== request) return
      const worker = createWorker()
      request.worker = worker
      worker.onmessage = ({ data }: MessageEvent<Output | null>) =>
        finish(data === null ? undefined : { name: file.name, data })
      worker.onerror = () => finish()
      worker.postMessage(buildMessage(file))
    } catch {
      finish()
    }
  }

  return { result, status, run }
}
