import { useEffect, useState } from "react"
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
import { Mail } from "@workspace/ui/icons"
import { MessageView } from "./message-view"
import { failure } from "./failure"
import type { Email, Failure, Messages } from "./types"

type Ready = {
  file: File
  email: Email
  preview: {
    html: string
    plainHtml: string
    limited: boolean
    dispose: () => void
  }
}

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [ready, setReady] = useState<Ready | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setReady(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (!/\.(eml|emlx|msg)$/i.test(file.name)) {
      setError("invalid")
      return
    }
    if (!file.size) {
      setError("emptyFile")
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    let preview: Ready["preview"] | undefined
    setLoading(true)
    void Promise.all([import("./open-email"), import("./preview")])
      .then(async ([{ openEmail }, { preparePreview }]) => {
        signal.throwIfAborted()
        const email = await openEmail(file, signal)
        signal.throwIfAborted()
        preview = preparePreview(email)
        setReady({ file, email, preview })
        setLoading(false)
      })
      .catch((reason) => {
        if (!signal.aborted) {
          setError(failure(reason))
          setLoading(false)
        }
      })
    return () => {
      controller.abort()
      preview?.dispose()
    }
  }, [file])
  return (
    <DocumentWorkspace
      tool="email-viewer"
      file={file}
      onFile={setFile}
      accept=".eml,.emlx,.msg,message/rfc822,application/vnd.ms-outlook"
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
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner />
          {m.loading}
        </p>
      ) : null}
      {!file ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mail />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats}
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {ready && ready.file === file ? (
        <MessageView email={ready.email} preview={ready.preview} messages={m} />
      ) : null}
    </DocumentWorkspace>
  )
}
