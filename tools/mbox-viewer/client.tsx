import { EmailArchiveViewer } from "@workspace/ui/components/tool/email-archive/viewer"
import { Mails } from "@workspace/ui/icons"
import type { ComponentProps } from "react"
import { sampleMailbox } from "./sample"

function createWorker() {
  return new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
}

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
      emptyIcon={<Mails aria-hidden="true" />}
      accept=""
      createWorker={createWorker}
      sample={sampleMailbox}
    />
  )
}
