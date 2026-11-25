import {
  legacyWordExtension,
  modernWordExtension,
  wordAccept,
} from "@workspace/legacy-doc/formats"
import { failure as legacyFailure } from "@workspace/legacy-doc/pdf/errors"
import { WordPdfConverter } from "@workspace/ui/components/tool/word-pdf-converter"
import type { WordPdfVariant } from "@workspace/ui/components/tool/word-pdf-converter"
import { failure } from "./core/errors"
import type { Messages } from "./types"

const variants = [
  {
    match: legacyWordExtension,
    load: () => import("@workspace/legacy-doc/pdf"),
    failure: legacyFailure,
    legacy: true,
  },
  {
    match: modernWordExtension,
    load: () => import("./core/convert"),
    failure,
  },
] satisfies readonly WordPdfVariant[]

export default function Client({ messages }: { messages: Messages }) {
  return (
    <WordPdfConverter
      tool="microsoft-word-to-pdf-converter"
      accept={wordAccept}
      formats="DOC · DOCX · DOCM · DOTX · DOTM"
      messages={messages}
      variants={variants}
      legacyNotes={messages.legacy}
    />
  )
}
