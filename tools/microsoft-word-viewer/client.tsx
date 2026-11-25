import { useRef, useState } from "react"
import {
  legacyWordExtension,
  modernWordExtension,
  wordAccept,
} from "@workspace/legacy-doc/formats"
import { DocumentView } from "@workspace/ui/components/tool/legacy-word-view"
import { useLegacyWordPreview } from "@workspace/ui/lib/use-legacy-word-preview"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
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
import { MarkdownExport } from "./markdown-export"
import type { Messages } from "./types"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const legacyFile = file && legacyWordExtension.test(file.name) ? file : null
  const modernFile = file && modernWordExtension.test(file.name) ? file : null
  const modern = useReader(modernFile, container, m)
  const legacy = useLegacyWordPreview(legacyFile, m.legacy)
  const legacyError =
    legacy && "error" in legacy
      ? legacy.error === "protected"
        ? m.legacy.protected
        : legacy.error === "resourceLimit"
          ? m.resourceLimit
          : m.invalid
      : ""
  const error =
    file && !legacyFile && !modernFile
      ? m.invalid
      : legacyError || (modernFile ? modern.error : "")
  const loading = legacy
    ? "loading" in legacy
    : Boolean(modernFile && modern.loading)
  const { reader, state } = modern
  return (
    <DocumentWorkspace
      tool="microsoft-word-viewer"
      file={file}
      onFile={setFile}
      accept={wordAccept}
      active={Boolean(file && !error)}
      messages={m}
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {legacy && "preview" in legacy ? (
        <DocumentView
          template={legacy.template}
          preview={legacy.preview}
          messages={m.legacy}
        />
      ) : null}
      <div
        className={
          legacy && "preview" in legacy
            ? "hidden"
            : "flex min-h-0 flex-1 flex-col overflow-hidden"
        }
      >
        {reader && file && state.total ? (
          <>
            <MarkdownExport
              reader={reader}
              filename={file.name}
              messages={m.markdown}
            />
            <Toolbar messages={m} state={state} reader={reader} />
          </>
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
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>
                DOC · DOCX · DOCM · DOTX · DOTM
                <br />
                {m.privacy}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <div
          className={
            modernFile && !error
              ? "relative min-h-48 flex-1 bg-muted"
              : "hidden"
          }
        >
          <div
            ref={container}
            className="docx-reader-container absolute inset-0 overflow-auto"
            dir="ltr"
            // A scrollable reading region needs keyboard focus for arrow keys.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={m.reader}
            aria-busy={loading}
          ></div>
        </div>
      </div>
    </DocumentWorkspace>
  )
}
