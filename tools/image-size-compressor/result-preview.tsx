import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import { Maximize2 } from "@workspace/ui/icons"

import { message } from "./messages"
import type { Messages } from "./messages"

export function ResultPreview({
  name,
  url,
  details,
  messages,
}: {
  name: string
  url: string
  details: string
  messages: Messages
}) {
  const label = message(messages.previewImage, { name })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          title={label}
          aria-label={label}
          className="relative size-full cursor-zoom-in rounded-md focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <img
            alt=""
            loading="lazy"
            decoding="async"
            src={url}
            className="size-full rounded-md object-contain"
          />
          <Maximize2
            aria-hidden="true"
            className="absolute end-0.5 bottom-0.5 size-4 rounded-sm bg-background/90 p-0.5"
          />
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-3xl"
        closeLabel={messages.closePreview}
      >
        <div className="grid gap-2 pe-6">
          <DialogTitle className="wrap-anywhere" dir="auto">
            {name}
          </DialogTitle>
          <DialogDescription dir="ltr" className="text-start tabular-nums">
            {details}
          </DialogDescription>
        </div>
        <img
          alt={label}
          src={url}
          className="mx-auto max-h-[70dvh] max-w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}
