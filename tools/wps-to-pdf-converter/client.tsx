import { wpsAccept, wpsExtension } from "@workspace/legacy-doc/formats"
import { failure } from "@workspace/legacy-doc/pdf/errors"
import { WordPdfConverter } from "@workspace/ui/components/tool/word-pdf-converter"
import type { WordPdfVariant } from "@workspace/ui/components/tool/word-pdf-converter"
import type { Messages } from "./types"

const variants = [
  {
    match: wpsExtension,
    load: () => import("@workspace/legacy-doc/pdf"),
    failure,
  },
] satisfies readonly WordPdfVariant[]

export default function Client({ messages }: { messages: Messages }) {
  return (
    <WordPdfConverter
      tool="wps-to-pdf-converter"
      accept={wpsAccept}
      messages={messages}
      variants={variants}
    />
  )
}
