import { ChevronDown, Folder } from "@workspace/ui/icons"
import type { FolderMessages } from "./copy"

export function FolderSelect({
  folders,
  value,
  messages,
  onChange,
}: {
  folders: string[]
  value: string
  messages: FolderMessages
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Folder
        aria-hidden="true"
        className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <select
        aria-label={messages.folders}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full appearance-none truncate rounded-lg border border-input bg-transparent ps-9 pe-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <option value="">{messages.allFolders}</option>
        {folders.map((name, index) => (
          <option key={index} value={index}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute inset-e-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
