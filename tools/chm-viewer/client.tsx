import { useEffect, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { BookOpen } from "@workspace/ui/icons"
import { Reader } from "./reader"

import type { Book } from "./book"
import type { Messages } from "./messages"

type Source = File | { sample: true }
type Result = {
  source: Source
  file: File | null
} & ({ book: Book } | { error: "invalid" | "noTopics" | "sampleError" })

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [source, setSource] = useState<Source | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!source) return
    const requested = source
    const controller = new AbortController()
    const { signal } = controller
    let opened: Book | null = null
    let file = requested instanceof File ? requested : null

    async function load() {
      try {
        if (!file) {
          const { loadSample } = await import("./sample")
          file = await loadSample(signal)
        }
        const { openBook } = await import("./book")
        opened = await openBook(file, signal)
        if (signal.aborted) {
          opened?.close()
          return
        }

        setResult(
          opened
            ? { source: requested, file, book: opened }
            : { source: requested, file, error: "noTopics" }
        )
      } catch {
        if (!signal.aborted) {
          setResult({
            source: requested,
            file,
            error: file ? "invalid" : "sampleError",
          })
        }
      }
    }

    void load()
    return () => {
      controller.abort()
      opened?.close()
    }
  }, [source])

  function changeSource(next: Source | null) {
    setResult(null)
    setSource(next)
  }

  const current = result?.source === source ? result : null
  const loading = source !== null && !current
  const error = current && "error" in current ? current.error : null
  const book = current && "book" in current ? current.book : null

  return (
    <DocumentWorkspace
      tool="chm-viewer"
      file={current?.file ?? (source instanceof File ? source : null)}
      onFile={changeSource}
      accept=".chm,application/vnd.ms-htmlhelp"
      active={Boolean(book)}
      messages={m}
    >
      {error && (
        <Alert variant="destructive" className="m-4 w-auto">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <p
          role="status"
          className="flex min-h-36 items-center justify-center gap-2 p-6 text-sm"
        >
          <Spinner />
          {m.loading}
        </p>
      ) : book ? (
        <Reader book={book} lang={lang} messages={m} />
      ) : source === null || error === "sampleError" ? (
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={() => changeSource({ sample: true })}
            >
              {m.sample}
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}
    </DocumentWorkspace>
  )
}
