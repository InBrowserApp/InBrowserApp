import type { ReactNode } from "react"
import type { IpfsReference } from "@workspace/ipfs-files"
import { FileBrowserPanel } from "@workspace/ui/components/tool/file-browser-panel"

import type { CarView } from "./client"
import type EnglishMessages from "./messages/en.json"

export function CarContents({
  view: { path, entry, children },
  language,
  messages,
  busy,
  feedback,
  browse,
  download,
}: {
  view: CarView
  language: string
  messages: typeof EnglishMessages
  busy: boolean
  feedback: ReactNode
  browse: (path: readonly IpfsReference[]) => void
  download: () => void
}) {
  return (
    <FileBrowserPanel
      path={path.map(({ name }) => name).join(" / ")}
      entries={
        entry.type === "directory" ? children.map(({ name }) => name) : null
      }
      size={
        entry.type === "directory"
          ? null
          : new Intl.NumberFormat(language, {
              style: "unit",
              unit: "byte",
            }).format(entry.size)
      }
      labels={messages}
      busy={busy}
      feedback={feedback}
      onBack={path.length > 1 ? () => browse(path.slice(0, -1)) : undefined}
      onOpen={(index) => browse([...path, children[index]!])}
      onDownload={download}
    />
  )
}
