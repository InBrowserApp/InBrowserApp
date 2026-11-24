import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"

import { Field, FormActions, Modal } from "./dialogs"
import { describeError, folderPrefix } from "./model"
import { ObjectDetailsDialog } from "./object-details-dialog"

import type { Labels } from "./model"
import type { ObjectStorage } from "./s3"

type StorageAction =
  | { kind: "path" | "folder" }
  | { kind: "upload"; files: File[] }
  | { kind: "copy"; key: string }
  | { kind: "delete"; keys: string[] }

export type ObjectAction = StorageAction | { kind: "details"; key: string }

type ObjectDialogProps = {
  action: ObjectAction
  service: ObjectStorage
  bucket: string
  buckets: string[]
  prefix: string
  labels: Labels
  close: () => void
  navigate: (path: string) => void
  done: (success?: boolean) => void
  download: (key: string) => Promise<void>
}

export function ObjectDialog({
  action,
  download,
  ...props
}: ObjectDialogProps) {
  if (action.kind === "details") {
    return (
      <ObjectDetailsDialog
        objectKey={action.key}
        download={download}
        {...props}
      />
    )
  }

  return <ObjectActionDialog action={action} {...props} />
}

function ObjectActionDialog({
  action,
  service,
  bucket,
  buckets,
  prefix,
  labels,
  close,
  navigate,
  done,
}: Omit<ObjectDialogProps, "action" | "download"> & { action: StorageAction }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [failures, setFailures] = useState<string[]>([])
  const [progress, setProgress] = useState("")
  const [partialMove, setPartialMove] = useState(false)

  async function run(task: () => Promise<void>) {
    setBusy(true)
    setError("")
    try {
      await task()
      done()
    } catch (reason) {
      setError(describeError(reason, labels))
    } finally {
      setProgress("")
      setBusy(false)
    }
  }

  async function batch<T>(
    items: T[],
    key: (item: T) => string,
    perform: (item: T) => Promise<unknown>
  ) {
    const failed: string[] = []
    let firstError = ""
    for (const [index, item] of items.entries()) {
      setProgress(`${index + 1} / ${items.length}`)
      try {
        await perform(item)
      } catch (reason) {
        if (!firstError) firstError = describeError(reason, labels)
        failed.push(key(item))
      }
    }
    if (failed.length) {
      setFailures(failed)
      throw new Error(firstError)
    }
  }

  const title = {
    path: labels.goToPath,
    folder: labels.newFolder,
    upload: labels.uploadFiles,
    copy: labels.copyMove,
    delete: labels.delete,
  }[action.kind]
  const description =
    action.kind === "upload"
      ? labels.uploadHint
      : action.kind === "delete"
        ? labels.deletePrompt
        : action.kind === "copy"
          ? labels.copyMoveHint
          : undefined
  const submit = {
    path: labels.open,
    folder: labels.create,
    upload: labels.upload,
    copy: labels.copyMove,
    delete: labels.delete,
  }[action.kind]

  const closeDialog = failures.length || partialMove ? () => done(false) : close

  return (
    <Modal
      title={title}
      description={description}
      labels={labels}
      close={closeDialog}
      busy={busy}
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const value = (name: string) => String(data.get(name) ?? "")
          const path = folderPrefix(value("path"))
          switch (action.kind) {
            case "path":
              navigate(path)
              return
            case "folder": {
              const name = value("name")
              if (
                !name.trim() ||
                name.includes("/") ||
                name === "." ||
                name === ".."
              ) {
                setError(labels.invalidFolder)
                return
              }
              void run(async () => {
                await service.makeFolder(bucket, prefix + name + "/")
              })
              return
            }
            case "upload":
              void run(() =>
                batch(action.files, uploadKey, (file) =>
                  service.put(
                    bucket,
                    path + uploadKey(file),
                    file,
                    file.type || undefined
                  )
                )
              )
              return
            case "delete":
              void run(() =>
                batch(
                  action.keys,
                  (key) => key,
                  (key) => service.remove(bucket, key)
                )
              )
              return
            case "copy": {
              const target = value("bucket")
              const key = value("key")
              if (target === bucket && key === action.key) {
                setError(labels.sameDestination)
                return
              }
              void run(async () => {
                if (value("operation") === "copy") {
                  await service.copy(bucket, action.key, target, key)
                  return
                }

                const etag = await service.etag(bucket, action.key)
                if (!etag) throw new Error(labels.corsHelp)
                await service.copy(bucket, action.key, target, key, etag)
                try {
                  await service.remove(bucket, action.key, etag)
                } catch {
                  setPartialMove(true)
                  throw new Error(labels.moveDeleteFailed)
                }
              })
            }
          }
        }}
      >
        {action.kind === "path" || action.kind === "upload" ? (
          <Field
            name="path"
            label={labels.prefix}
            hint={labels.prefixHint}
            defaultValue={prefix}
            dir="ltr"
          />
        ) : action.kind === "folder" ? (
          <Field name="name" label={labels.folderName} required dir="ltr" />
        ) : null}
        {action.kind === "copy" && (
          <>
            <label className="grid gap-1.5 text-sm font-medium">
              {labels.destinationBucket}
              <select
                name="bucket"
                defaultValue={bucket}
                dir="ltr"
                className="h-9 rounded-md border bg-background px-3"
              >
                {buckets.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <Field
              name="key"
              label={labels.destinationKey}
              required
              defaultValue={action.key}
              dir="ltr"
            />
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="operation"
                  value="copy"
                  defaultChecked
                />
                {labels.copy}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="operation" value="move" />
                {labels.move}
              </label>
            </div>
          </>
        )}
        {action.kind === "upload" && (
          <ObjectKeys keys={action.files.map(uploadKey)} />
        )}
        {action.kind === "delete" && <ObjectKeys keys={action.keys} />}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {progress && (
          <p role="status" dir="ltr" className="text-sm tabular-nums">
            {progress}
          </p>
        )}
        {failures.length > 0 ? (
          <>
            <div className="rounded-md bg-muted p-2 text-sm">
              {labels.failedObjects}
              <ObjectKeys keys={failures} />
            </div>
            <Button type="button" variant="outline" onClick={closeDialog}>
              {labels.cancel}
            </Button>
          </>
        ) : (
          <FormActions
            labels={labels}
            close={closeDialog}
            action={submit}
            busy={busy}
            destructive={action.kind === "delete"}
          />
        )}
      </form>
    </Modal>
  )
}

function uploadKey(file: File) {
  return file.webkitRelativePath || file.name
}

function ObjectKeys({ keys }: { keys: string[] }) {
  return (
    <ul
      className="max-h-36 overflow-auto rounded-md border p-2 font-mono text-xs"
      dir="ltr"
    >
      {keys.map((key, index) => (
        <li key={index} className="py-0.5 break-all">
          {key}
        </li>
      ))}
    </ul>
  )
}
