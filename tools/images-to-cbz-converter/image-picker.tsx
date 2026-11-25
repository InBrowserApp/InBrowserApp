import { useRef } from "react"
import type { ChangeEvent, RefObject } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Folder, Plus } from "@workspace/ui/icons"
import { accept } from "./images"
import type { Messages } from "./types"

export function ImagePicker({
  addButton,
  hasPages,
  disabled,
  onFiles,
  messages: m,
}: {
  addButton: RefObject<HTMLButtonElement | null>
  hasPages: boolean
  disabled: boolean
  onFiles: (files: FileList | null) => Promise<void>
  messages: Messages
}) {
  const input = useRef<HTMLInputElement>(null)
  const folder = useRef<HTMLInputElement>(null)

  function selectImages({ currentTarget }: ChangeEvent<HTMLInputElement>) {
    void onFiles(currentTarget.files)
    currentTarget.value = ""
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <input
        ref={input}
        type="file"
        multiple
        accept={accept}
        hidden
        aria-label={m.open}
        onChange={selectImages}
      />
      <input
        ref={folder}
        type="file"
        multiple
        hidden
        aria-label={m.folder}
        {...{ webkitdirectory: "" }}
        onChange={selectImages}
      />
      <Button
        ref={addButton}
        type="button"
        variant={hasPages ? "outline" : "default"}
        className="min-h-11"
        disabled={disabled}
        onClick={() => input.current?.click()}
      >
        <Plus data-icon="inline-start" aria-hidden="true" />
        {hasPages ? m.add : m.open}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        disabled={disabled}
        onClick={() => folder.current?.click()}
      >
        <Folder data-icon="inline-start" aria-hidden="true" />
        {m.folder}
      </Button>
    </div>
  )
}
