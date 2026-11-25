export function createMboxWorker() {
  return new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
}
