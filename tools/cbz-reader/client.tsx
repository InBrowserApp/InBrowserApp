import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ImageIcon } from "@workspace/ui/icons"
import { Reader } from "./components/reader"
import { useComic } from "./use-comic"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { opened, error, loading } = useComic(file)
  return (
    <>
      <DocumentWorkspace
        tool="cbz-reader"
        file={file}
        onFile={setFile}
        accept=".cbz,application/vnd.comicbook+zip"
        active={Boolean(file && !error)}
        messages={m}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription>{m[error]}</AlertDescription>
          </Alert>
        ) : null}
        {loading ? (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
          >
            <Spinner />
            {m.loading}
          </p>
        ) : null}
        {opened ? (
          <Reader key={file!.name + file!.lastModified} {...opened} m={m} />
        ) : null}
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>{m.privacy}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
      </DocumentWorkspace>
      <p className="mt-2 text-xs text-muted-foreground">{m.order}</p>
      <p className="mt-1 text-xs text-muted-foreground">{m.keyboard}</p>
    </>
  )
}
