import { EmailArchiveViewer } from "@workspace/ui/components/tool/email-archive/viewer"
import type { ComponentProps } from "react"
import type own from "./messages/en.json"

function createWorker() {
  return new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
}

type Messages = ComponentProps<typeof EmailArchiveViewer>["messages"] &
  typeof own

export default function Client({
  messages,
  lang,
  title,
}: {
  messages: Messages
  lang: string
  title: string
}) {
  return (
    <EmailArchiveViewer
      tool="pst-viewer"
      icon="archive"
      accept=".pst"
      createWorker={createWorker}
      messages={messages}
      folderMessages={messages}
      lang={lang}
      title={title}
    />
  )
}
