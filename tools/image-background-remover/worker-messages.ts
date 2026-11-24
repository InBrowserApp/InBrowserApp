export type WorkerUpdate =
  | { type: "preparing" | "processing" }
  | { type: "invalidImage" | "modelFailed" | "processingFailed" }
  | { type: "ready"; png: Blob; width: number; height: number }
