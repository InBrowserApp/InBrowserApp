export type { Request, Response } from "./render.worker"

export function createMidiRenderWorker() {
  return new Worker(new URL("./render.worker.ts", import.meta.url), {
    type: "module",
  })
}
