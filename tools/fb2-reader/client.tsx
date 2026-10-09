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
import { BookOpen } from "@workspace/ui/icons"
import { BookReader } from "@workspace/ui/components/tool/book-reader/book-reader"
import { useBook } from "./use-book"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const result = useBook(file, m)
  return (
    <DocumentWorkspace
      tool="fb2-reader"
      file={file}
      onFile={setFile}
      accept=".fb2,.fbz,.fb2.zip,application/x-fictionbook+xml"
      active={Boolean(file && !result?.error)}
      messages={m}
    >
      {result?.error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : null}
      {!file ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : !result ? (
        <p role="status" className="flex items-center justify-center gap-2 p-6">
          <Spinner />
          {m.loading}
        </p>
      ) : result.book ? (
        <BookReader book={result.book} messages={m} />
      ) : null}
    </DocumentWorkspace>
  )
}
