import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Clipboard } from "@workspace/ui/icons"
import type { Messages } from "./types"

export function PasteDialog({
  messages: m,
  read,
}: {
  messages: Messages
  read: (text: string) => boolean
}) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [error, setError] = useState(false)
  function changeOpen(next: boolean) {
    setOpen(next)
    setError(false)
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Clipboard data-icon="inline-start" aria-hidden="true" />
          {m.paste}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{m.pasteTitle}</DialogTitle>
          <DialogDescription>{m.pasteHint}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (!read(text)) {
              setError(true)
              return
            }
            setText("")
            changeOpen(false)
          }}
        >
          <Textarea
            className="max-h-64 min-h-36 font-mono text-sm"
            dir="ltr"
            aria-label={m.pasteTitle}
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setError(false)
            }}
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{m.invalid}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {m.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!text.trim()}>
              {m.import}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
