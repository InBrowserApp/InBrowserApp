import { afterEach, describe, expect, it, vi } from "vitest"

import { checkWorkflow } from "./check-workflow"
import type { WorkflowCheck } from "./protocol"

const terminate = vi.fn()

function respondToWorker(reply: WorkflowCheck | Error) {
  vi.stubGlobal(
    "Worker",
    class {
      onmessage?: (event: { data: WorkflowCheck }) => void
      onerror?: (event: Error) => void
      terminate = terminate

      postMessage() {
        queueMicrotask(() => {
          if (reply instanceof Error) this.onerror?.(reply)
          else this.onmessage?.({ data: reply })
        })
      }
    }
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  terminate.mockClear()
})

describe("workflow worker", () => {
  it("finds offsets in the editor for engine positions", async () => {
    const source = "on: push\n# 🚀 next\n"
    respondToWorker({
      issues: [
        { message: "Error", line: 2, column: 5 },
        { message: "End", line: 9, column: 1 },
        { message: "Start", line: 0, column: 0 },
      ],
    })
    expect(await checkWorkflow(source)).toEqual([
      {
        message: "Error",
        location: { line: 2, column: 5, offset: source.indexOf("next") },
      },
      {
        message: "End",
        location: { line: 9, column: 1, offset: source.length },
      },
      {
        message: "Start",
        location: { line: 1, column: 1, offset: 0 },
      },
    ])
    expect(terminate).toHaveBeenCalledOnce()
  })

  it("terminates the worker if the engine reports or emits an error", async () => {
    for (const failure of [{ error: "Load failed" }, Error("Load failed")]) {
      respondToWorker(failure)
      await expect(checkWorkflow("on: push")).rejects.toThrow("Load failed")
    }
    expect(terminate).toHaveBeenCalledTimes(2)
  })
})
