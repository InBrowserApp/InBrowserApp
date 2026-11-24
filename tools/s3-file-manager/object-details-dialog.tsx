import { useEffect, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileText } from "@workspace/ui/icons"

import { FormActions, Modal, PreviewImage } from "./dialogs"
import { describeError } from "./model"

import type { Labels } from "./model"
import type { ObjectDetails, ObjectStorage } from "./s3"

export function ObjectDetailsDialog({
  objectKey,
  service,
  bucket,
  labels,
  close,
  done,
  download,
}: {
  objectKey: string
  service: ObjectStorage
  bucket: string
  labels: Labels
  close: () => void
  done: () => void
  download: (key: string) => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const [previewError, setPreviewError] = useState("")
  const [actionError, setActionError] = useState("")
  const [details, setDetails] = useState<ObjectDetails>()
  const [editing, setEditing] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const editButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    service.details(bucket, objectKey, controller.signal).then(
      (result) => {
        if (!controller.signal.aborted) setDetails(result)
      },
      (reason) => {
        if (!controller.signal.aborted)
          setPreviewError(describeError(reason, labels))
      }
    )
    return () => controller.abort()
  }, [objectKey, bucket, labels, service])

  useEffect(() => {
    if (editing) editor.current?.focus()
  }, [editing])

  async function run(task: () => Promise<void>) {
    setBusy(true)
    setActionError("")
    try {
      await task()
    } catch (reason) {
      setActionError(describeError(reason, labels))
    } finally {
      setBusy(false)
    }
  }

  const saveText = details?.saveText

  return (
    <Modal title={labels.details} labels={labels} close={close} busy={busy}>
      <dl className="grid gap-1 text-sm">
        <dt className="font-medium">{labels.objectKey}</dt>
        <dd
          className="mb-2 font-mono break-all text-muted-foreground"
          dir="ltr"
        >
          {objectKey}
        </dd>
        {details && (
          <>
            <dt className="font-medium">{labels.contentType}</dt>
            <dd className="font-mono break-all text-muted-foreground" dir="ltr">
              {details.contentType}
            </dd>
          </>
        )}
      </dl>
      {previewError && (
        <p role="alert" className="text-sm text-destructive">
          {previewError}
        </p>
      )}
      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}
      {!details && !previewError && (
        <p role="status" className="text-sm text-muted-foreground">
          {labels.loading}
        </p>
      )}
      {details?.image && (
        <PreviewImage image={details.image} name={objectKey} />
      )}
      {details && details.text === undefined && !details.image && (
        <p className="text-sm text-muted-foreground">
          {labels.previewUnavailable}
        </p>
      )}
      {editing && saveText ? (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            const value = editor.current?.value ?? ""
            void run(async () => {
              await saveText(value)
              done()
            })
          }}
        >
          <Textarea
            ref={editor}
            dir="ltr"
            defaultValue={details.text}
            aria-label={labels.editText}
            className="h-52 font-mono text-sm"
            disabled={busy}
          />
          <p className="text-xs text-muted-foreground">
            {labels.textOverwrite}
          </p>
          <FormActions
            labels={labels}
            close={() => {
              setActionError("")
              setEditing(false)
              requestAnimationFrame(() => editButton.current?.focus())
            }}
            action={labels.saveText}
            busy={busy}
          />
        </form>
      ) : (
        <>
          {details?.text !== undefined && (
            <Textarea
              readOnly
              value={details.text}
              aria-label={labels.details}
              dir="ltr"
              className="h-52 resize-y bg-muted font-mono text-sm"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => void run(() => download(objectKey))}
            >
              <Download />
              {labels.download}
            </Button>
            {saveText && (
              <Button
                ref={editButton}
                disabled={busy}
                onClick={() => {
                  setActionError("")
                  setEditing(true)
                }}
              >
                <FileText />
                {labels.editText}
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
