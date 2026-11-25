import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Folder, Mails } from "@workspace/ui/icons"
import { Mailbox } from "./mailbox"
import { sampleMailbox } from "./sample"
import type { Messages } from "./types"

export default function Client({
  messages: m,
  lang,
  title,
}: {
  messages: Messages
  lang: string
  title: string
}) {
  const [input, setInput] = useState<{ file: File | null; revision: number }>({
    file: null,
    revision: 0,
  })
  function open(file: File | null) {
    setInput((previous) => ({ file, revision: previous.revision + 1 }))
  }
  return (
    <DocumentWorkspace
      tool="mbox-viewer"
      file={input.file}
      onFile={open}
      accept=""
      active={Boolean(input.file)}
      messages={{ ...m, reader: title }}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-72 rounded-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mails aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.formats}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={chooseFile} data-file-open>
                <Folder data-icon="inline-start" aria-hidden="true" />
                {m.open}
              </Button>
              <Button variant="outline" onClick={() => open(sampleMailbox())}>
                {m.sample}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{m.privacy}</p>
          </EmptyContent>
        </Empty>
      )}
    >
      {input.file && (
        <Mailbox
          key={input.revision}
          file={input.file}
          lang={lang}
          messages={m}
        />
      )}
    </DocumentWorkspace>
  )
}
