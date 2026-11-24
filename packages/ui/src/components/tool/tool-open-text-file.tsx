import { useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { FolderInput } from "@workspace/ui/icons"

export function ToolOpenTextFile({
  accept,
  label,
  onFile,
}: {
  accept: string
  label: string
  onFile: (file: File) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) onFile(file)
        }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => input.current?.click()}
      >
        <FolderInput data-icon="inline-start" aria-hidden="true" />
        {label}
      </Button>
    </>
  )
}

export function useTextFileImport() {
  const revision = useRef(0)
  return {
    cancel: () => {
      revision.current += 1
    },
    async read(
      file: File,
      onText: (source: string) => void,
      onError: () => void
    ) {
      const selected = ++revision.current
      let source: string
      try {
        source = await file.text()
      } catch {
        if (selected === revision.current) onError()
        return
      }
      if (selected === revision.current) onText(source)
    },
  }
}
