import { useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { Table2 } from "@workspace/ui/icons"
import { Viewer } from "./components/viewer"
import sampleUrl from "./fixtures/sample.parquet?url"
import type { Messages } from "./types"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [selection, setSelection] = useState<{ file: File; id: number } | null>(
    null
  )
  const revision = useRef(0)
  const [sampleError, setSampleError] = useState(false)
  const [sampleBusy, setSampleBusy] = useState(false)
  function select(file: File | null) {
    revision.current++
    setSampleBusy(false)
    setSampleError(false)
    setSelection(file ? { file, id: revision.current } : null)
  }
  async function sample() {
    const id = ++revision.current
    setSampleBusy(true)
    setSampleError(false)
    try {
      const response = await fetch(sampleUrl)
      if (!response.ok) throw new Error("Sample unavailable")
      const blob = await response.blob()
      if (id === revision.current) select(new File([blob], "sample.parquet"))
    } catch {
      if (id === revision.current) setSampleError(true)
    } finally {
      if (id === revision.current) setSampleBusy(false)
    }
  }
  return (
    <DocumentWorkspace
      tool="parquet-viewer"
      file={selection?.file ?? null}
      onFile={select}
      accept=".parquet,.parq,application/vnd.apache.parquet"
      active={Boolean(selection)}
      messages={m}
    >
      {selection ? (
        <Viewer
          key={selection.id}
          file={selection.file}
          messages={m}
          lang={lang}
        />
      ) : (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Table2 aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.hint}</EmptyDescription>
          </EmptyHeader>
          <Button
            variant="outline"
            onClick={() => void sample()}
            disabled={sampleBusy}
          >
            {sampleBusy ? m.loading : m.sample}
          </Button>
          <p className="text-xs text-muted-foreground">{m.privacy}</p>
          {sampleError ? (
            <p role="alert" className="text-sm text-destructive">
              {m.error}
            </p>
          ) : null}
        </Empty>
      )}
    </DocumentWorkspace>
  )
}
