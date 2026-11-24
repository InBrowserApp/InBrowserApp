export function createWhisperWorker() {
  return new Worker(new URL("./transcribe.worker.ts", import.meta.url), {
    type: "module",
  })
}
