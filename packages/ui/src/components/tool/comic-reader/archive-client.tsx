import { useCallback, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { BookOpen, Folder } from "@workspace/ui/icons"
import { comicArchiveFormats, type ComicArchiveKind } from "./archive-formats"
import { Reader } from "./reader"
import { useComic } from "./use-comic"
import type { Messages } from "./types"

export type ArchiveReaderMessages = Messages & {
  open: string
  drop: string
  privacy: string
  invalid: string
  damaged: string
}

export default function ArchiveClient({
  kind,
  messages: m,
}: {
  kind: ComicArchiveKind
  messages: ArchiveReaderMessages
}) {
  const [selection, setSelection] = useState<{ file: File | null; id: number }>(
    { file: null, id: 0 }
  )
  const { file } = selection
  const { decoder, extensions } = comicArchiveFormats[kind]
  const open = useCallback(
    (file: File, signal: AbortSignal) =>
      import("@workspace/comic/compressed").then(({ openCompressedComic }) =>
        openCompressedComic(file, decoder, signal)
      ),
    [decoder]
  )
  const { opened, error, loading } = useComic(file, extensions, open)

  return (
    <div>
      <DocumentWorkspace
        tool={`${kind}-reader`}
        file={file}
        onFile={(file) =>
          setSelection((current) => ({ file, id: current.id + 1 }))
        }
        accept={extensions.join(",")}
        active={Boolean(file && !error)}
        messages={m}
        renderEmpty={(choose) => (
          <div className="flex min-h-60 flex-col items-center justify-center gap-3 bg-muted/30 px-5 py-8 text-center">
            <div className="grid size-12 place-items-center rounded-xl border bg-background text-primary shadow-xs">
              <BookOpen className="size-6" aria-hidden="true" />
            </div>
            <Button data-file-open onClick={choose}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <p className="text-sm text-muted-foreground">{m.drop}</p>
            <p className="text-xs text-muted-foreground">{m.privacy}</p>
          </div>
        )}
      >
        {error && (
          <Alert variant="destructive" className="m-3 w-auto">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription>{m[error]}</AlertDescription>
          </Alert>
        )}
        {loading && (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-8"
          >
            <Spinner />
            {m.loading}
          </p>
        )}
        {opened && <Reader key={selection.id} {...opened} m={m} />}
      </DocumentWorkspace>
      {opened && (
        <p className="mt-2 text-xs text-muted-foreground">{m.keyboard}</p>
      )}
    </div>
  )
}
