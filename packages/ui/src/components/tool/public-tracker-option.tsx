import { useId } from "react"
import type { TorrentMessages } from "./torrent-types"

type PublicTrackerMessages = Pick<
  TorrentMessages,
  "publicTrackers" | "publicTrackersHint"
>

function PublicTrackerOption({
  checked,
  onChange,
  disabled,
  messages,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled: boolean
  messages: PublicTrackerMessages
}) {
  const id = useId()

  return (
    <div className="flex items-start gap-2">
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 accent-primary"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
        aria-describedby={`${id}-hint`}
      />
      <div className="grid min-w-0 gap-1">
        <label htmlFor={id} className="text-sm font-medium">
          {messages.publicTrackers}
        </label>
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {messages.publicTrackersHint}
        </p>
      </div>
    </div>
  )
}

export { PublicTrackerOption }
export type { PublicTrackerMessages }
