export type Scale = 2 | 4

export type UpscaleRequest = { file: File; scale: Scale }

export type UpscaleUpdate =
  | { type: "loading" }
  | { type: "progress"; fraction: number }
  | { type: "done"; png: Blob }
  | { type: "failed" }
