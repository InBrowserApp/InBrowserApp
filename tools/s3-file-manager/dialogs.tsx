import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { LoaderCircle } from "@workspace/ui/icons"

import type { ComponentProps, ReactNode } from "react"
import type { Labels } from "./model"

export function Modal({
  title,
  description,
  labels,
  close,
  busy,
  children,
}: {
  title: string
  description?: string
  labels: Labels
  close: () => void
  busy?: boolean
  children: ReactNode
}) {
  const [opener] = useState(() => {
    if (typeof document === "undefined") return null
    const active = document.activeElement
    const menuTrigger = active
      ?.closest('[data-slot="dropdown-menu-content"]')
      ?.getAttribute("aria-labelledby")
    return (menuTrigger && document.getElementById(menuTrigger)) || active
  })
  return (
    <Dialog open onOpenChange={(open) => !open && !busy && close()}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rtl:[&>[data-slot=dialog-close]]:right-auto rtl:[&>[data-slot=dialog-close]]:left-4"
        {...(!description && { "aria-describedby": undefined })}
        closeLabel={labels.cancel}
        showCloseButton={!busy}
        onCloseAutoFocus={(event) => {
          if (opener instanceof HTMLElement && opener.isConnected) {
            event.preventDefault()
            opener.focus()
          }
        }}
      >
        <DialogHeader className="pe-6 sm:text-start">
          <DialogTitle className="wrap-anywhere">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function FormActions({
  labels,
  close,
  action,
  busy,
  destructive,
}: {
  labels: Labels
  close: () => void
  action: string
  busy?: boolean
  destructive?: boolean
}) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" disabled={busy} onClick={close}>
        {labels.cancel}
      </Button>
      <Button
        type="submit"
        variant={destructive ? "destructive" : "default"}
        disabled={busy}
      >
        {busy && <LoaderCircle className="animate-spin" />}
        {action}
      </Button>
    </DialogFooter>
  )
}

export function Field({
  label,
  hint,
  multiline,
  ...input
}: Omit<ComponentProps<"input">, "size"> & {
  label: string
  hint?: string
  multiline?: boolean
}) {
  const id = useId()
  const describedBy = hint ? id + "-hint" : undefined
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <Textarea
          id={id}
          name={input.name}
          defaultValue={input.defaultValue}
          dir="ltr"
          rows={3}
          aria-describedby={describedBy}
        />
      ) : (
        <Input {...input} id={id} aria-describedby={describedBy} />
      )}
      {hint && (
        <p id={id + "-hint"} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export function CorsDialog({
  labels,
  rule,
  close,
}: {
  labels: Labels
  rule: string
  close: () => void
}) {
  return (
    <Modal
      title={labels.corsHelp}
      description={labels.corsIntro}
      labels={labels}
      close={close}
    >
      <pre
        className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs"
        dir="ltr"
      >
        {rule}
      </pre>
      <p className="text-sm text-muted-foreground">{labels.corsList}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          className="text-primary underline"
          target="_blank"
          rel="noreferrer"
          href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html"
        >
          {labels.awsCors}
        </a>
        <a
          className="text-primary underline"
          target="_blank"
          rel="noreferrer"
          href="https://developers.cloudflare.com/r2/buckets/cors/"
        >
          {labels.r2Cors}
        </a>
      </div>
      <ToolCopyButton
        value={rule}
        copyLabel={labels.corsCopy}
        copiedLabel={labels.corsCopied}
        failedLabel={labels.requestFailed}
        className="justify-self-start"
        size="default"
      />
    </Modal>
  )
}

export function PreviewImage({ image, name }: { image: Blob; name: string }) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const next = URL.createObjectURL(image)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [image])
  return url ? (
    <img
      src={url}
      alt={name}
      className="max-h-80 max-w-full rounded-md object-contain"
    />
  ) : null
}
