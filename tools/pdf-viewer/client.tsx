import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@workspace/ui/components/ui/field"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { FileText, Folder, X } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Toolbar } from "./components/toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const input = useRef<HTMLInputElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [secret, setSecret] = useState("")
  const id = useId()
  const { state, loading, error, password, reader, submitPassword } = useReader(
    file,
    container,
    m
  )
  function selectFile(next: File | null) {
    setFile(next)
    setSecret("")
  }
  return (
    <section
      data-tool="pdf-viewer"
      className="flex min-w-0 flex-col gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const next = event.dataTransfer.files[0]
        if (next) selectFile(next)
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => input.current?.click()}>
          <Folder data-icon="inline-start" />
          {file ? m.replace : m.open}
        </Button>
        {file ? (
          <>
            <span dir="auto" className="min-w-0 flex-1 truncate text-sm">
              {file.name}{" "}
              <span className="text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={m.clear}
              onClick={() => selectFile(null)}
            >
              <X />
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{m.limits}</span>
        )}
        <input
          ref={input}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          aria-label={m.open}
          onChange={(event) => {
            const next = event.target.files?.[0]
            if (next) selectFile(next)
            event.target.value = ""
          }}
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {password ? (
        <form
          className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
          onSubmit={(event) => {
            event.preventDefault()
            submitPassword(secret)
            setSecret("")
          }}
        >
          <Field className="min-w-48 flex-1">
            <FieldLabel htmlFor={id}>{m.password}</FieldLabel>
            <Input
              id={id}
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
            />
            <FieldDescription>
              {password === "incorrect" ? m.wrongPassword : m.passwordHint}
            </FieldDescription>
          </Field>
          <Button type="submit">{m.unlock}</Button>
        </form>
      ) : null}
      <div className="overflow-hidden rounded-xl border">
        {reader.current && state.total ? (
          <Toolbar messages={m} state={state} reader={reader.current} />
        ) : null}
        {loading && !password ? (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
          >
            <Spinner />
            {m.loading}
          </p>
        ) : null}
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>{m.privacy}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <div
          className={
            file && !error ? "relative h-[70vh] min-h-80 bg-muted" : "hidden"
          }
        >
          <div
            ref={container}
            className="pdf-reader-container absolute inset-0 overflow-auto"
            dir="ltr"
            // A scrollable reading region needs keyboard focus for arrow keys.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={m.reader}
            aria-busy={loading}
          >
            <div className="pdfViewer" />
          </div>
        </div>
      </div>
    </section>
  )
}
