import { EmailArchiveViewer } from "@workspace/ui/components/tool/email-archive/viewer"
import type { ComponentProps } from "react"
import { createMboxWorker } from "./create-worker"
import { sampleMailbox } from "./sample"

export default function Client(
  props: Pick<
    ComponentProps<typeof EmailArchiveViewer>,
    "lang" | "title" | "messages"
  >
) {
  return (
    <EmailArchiveViewer
      {...props}
      tool="mbox-viewer"
      icon="mails"
      accept=""
      createWorker={createMboxWorker}
      sample={sampleMailbox}
    />
  )
}
