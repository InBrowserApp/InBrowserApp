import { useId, useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
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
import { FileText } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { DocumentToolbar as Toolbar } from "@workspace/ui/components/tool/document-toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
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
    <DocumentWorkspace
      tool="pdf-viewer"
      file={file}
      onFile={selectFile}
      accept=".pdf,application/pdf"
      active={Boolean(file && !error)}
      messages={m}
    >
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
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
            file && !error ? "relative min-h-48 flex-1 bg-muted" : "hidden"
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
    </DocumentWorkspace>
  )
}
