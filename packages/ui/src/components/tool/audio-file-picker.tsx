import { FileDropPicker } from "./file-drop-picker"
import { Volume2 } from "@workspace/ui/icons"

import type { ComponentProps } from "react"

export function AudioFilePicker(
  props: Pick<
    ComponentProps<typeof FileDropPicker>,
    "name" | "labels" | "onFile"
  >
) {
  return (
    <FileDropPicker
      {...props}
      accept="audio/*,.wav,.mp3,.m4a,.flac,.ogg,.oga,.aac,.opus,.webm"
      formats="WAV · MP3 · M4A · FLAC · OGG"
      icon={Volume2}
    />
  )
}
