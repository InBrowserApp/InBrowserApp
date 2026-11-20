import type { ComponentProps } from "react"
import type { Preview } from "@workspace/ui/components/tool/animation-maker/preview"

export type Messages = typeof import("./messages/en.json")
export type PreviewMessages = ComponentProps<typeof Preview>["messages"]

export type EncodeCommand =
  | { type: "start"; width: number; height: number }
  | { type: "frame"; pixels: Uint8ClampedArray<ArrayBuffer>; delay: number }
  | { type: "finish" }
