import type { Ref } from "react"

import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Lock } from "@workspace/ui/icons"

import type englishMessages from "./messages/en.json"

type Props = {
  file: Blob
  filename: string
  headingRef: Ref<HTMLHeadingElement>
  messages: Pick<
    typeof englishMessages,
    "protected" | "downloadPdf" | "startOver"
  >
  onStartOver: () => void
}

export function ProtectedPdf({
  file,
  filename,
  headingRef,
  messages,
  onStartOver,
}: Props) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-4 px-2 py-8 text-center">
      <span className="rounded-xl border bg-muted/50 p-3 text-primary">
        <Lock className="size-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 space-y-1">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold outline-none"
        >
          {messages.protected}
        </h2>
        <p
          className="line-clamp-2 text-sm wrap-anywhere text-muted-foreground"
          dir="auto"
          title={filename}
        >
          {filename}
        </p>
      </div>
      <div className="grid w-full max-w-sm gap-2 *:h-auto *:min-h-11 *:px-4 *:py-2 *:whitespace-normal sm:w-auto sm:max-w-none sm:grid-flow-col">
        <DocumentDownload
          file={file}
          filename={filename}
          label={messages.downloadPdf}
        />
        <Button type="button" variant="outline" onClick={onStartOver}>
          {messages.startOver}
        </Button>
      </div>
    </div>
  )
}
