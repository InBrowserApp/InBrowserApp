import { useState } from "react"
import type { ReactNode } from "react"
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
import { Folder } from "@workspace/ui/icons"
import { Mailbox } from "./mailbox"
import type { ArchiveMessages, FolderMessages } from "./copy"

export function EmailArchiveViewer({
  tool,
  emptyIcon,
  accept,
  createWorker,
  sample,
  folderMessages,
  messages: m,
  lang,
  title,
}: {
  tool: string
  emptyIcon: ReactNode
  accept: string
  createWorker: () => Worker
  sample?: () => File
  folderMessages?: FolderMessages
  messages: ArchiveMessages
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
      tool={tool}
      file={input.file}
      onFile={open}
      accept={accept}
      active={Boolean(input.file)}
      messages={{ ...m, reader: title }}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-72 rounded-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">{emptyIcon}</EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.formats}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={chooseFile} data-file-open>
                <Folder data-icon="inline-start" aria-hidden="true" />
                {m.open}
              </Button>
              {sample && (
                <Button variant="outline" onClick={() => open(sample())}>
                  {m.sample}
                </Button>
              )}
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
          createWorker={createWorker}
          folderMessages={folderMessages}
          lang={lang}
          messages={m}
        />
      )}
    </DocumentWorkspace>
  )
}
