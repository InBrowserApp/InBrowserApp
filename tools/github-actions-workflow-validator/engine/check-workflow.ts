import { attachLocations } from "./diagnostics"
import type { WorkflowCheck, WorkflowDiagnostic } from "./protocol"

async function checkWorkflow(source: string) {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  })

  try {
    const diagnostics = await new Promise<WorkflowDiagnostic[]>(
      (resolve, reject) => {
        worker.onmessage = ({ data }: MessageEvent<WorkflowCheck>) => {
          if ("error" in data) reject(new Error(data.error))
          else resolve(data.issues)
        }
        worker.onerror = (event) => reject(new Error(event.message))
        worker.onmessageerror = () =>
          reject(new Error("Could not read the actionlint result"))
        worker.postMessage(source)
      }
    )
    return attachLocations(source, diagnostics)
  } finally {
    worker.terminate()
  }
}

export { checkWorkflow }
