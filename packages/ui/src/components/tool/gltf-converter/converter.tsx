import { useRef, useState } from "react"
import {
  ArrowLeftRight,
  Box,
  Folder,
  FolderInput,
  FolderPlus,
} from "../../../icons"
import { useMeshWorker } from "../../../lib/use-mesh-worker"
import { cn } from "../../../lib/utils"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"
import { Spinner } from "../../ui/spinner"
import { DocumentDownload } from "../document-download"
import { exampleFile } from "../model-viewer/load-model"
import type { GltfPackResult } from "@workspace/model-mesh/gltf-pack"
import type { ChangeEvent } from "react"
import type { GltfConverterMessages } from "./messages"

type Selection = { model: File; models: File[]; assets: File[] }

const isModel = (file: File) => /\.gltf$/i.test(file.name)
const filePath = (file: File) => file.webkitRelativePath || file.name

function displayPath(path: string) {
  try {
    return decodeURI(path)
  } catch {
    return path
  }
}

export default function GltfConverter({
  messages: m,
}: {
  messages: GltfConverterMessages
}) {
  const input = useRef<HTMLInputElement>(null)
  const folder = useRef<HTMLInputElement>(null)
  const [selection, setSelection] = useState<Selection>()
  const [dragging, setDragging] = useState(false)
  const [noModel, setNoModel] = useState(false)
  const [saved, setSaved] = useState<{
    id: number
    source: string
    glb: Blob
  }>()
  const { result, status, run } = useMeshWorker<GltfPackResult, File[]>(
    () => exampleFile("gltf"),
    () =>
      new Worker(new URL("./pack.worker.ts", import.meta.url), {
        type: "module",
      }),
    (file, assets) => ({ file, assets: assets ?? [] })
  )

  if (result?.data.kind === "ready" && result.id !== saved?.id) {
    setSaved({
      id: result.id,
      source: result.file.name,
      glb: result.data.glb,
    })
  }

  function pack(next: Selection) {
    setNoModel(false)
    setSelection(next)
    void run(next.model, next.assets)
  }

  function open(files: File[]) {
    if (!files.length) return
    const models = files.filter(isModel)
    const model = models[0]
    if (model) {
      pack({ model, models, assets: files.filter((file) => !isModel(file)) })
    } else if (selection) {
      const combined = new Map(
        selection.assets.map((file) => [filePath(file), file])
      )
      for (const file of files) combined.set(filePath(file), file)
      pack({ ...selection, assets: [...combined.values()] })
    } else {
      setNoModel(true)
    }
  }

  function pickFiles(event: ChangeEvent<HTMLInputElement>) {
    open(Array.from(event.currentTarget.files ?? []))
    event.currentTarget.value = ""
  }

  const current = !status && !noModel ? result?.data : undefined
  const missing = current?.kind === "missing" ? current.paths : undefined
  const error = noModel
    ? m.noModel
    : status === "failed"
      ? m.failed
      : current?.kind === "unsupported"
        ? m.unsupported
        : undefined
  const models = selection?.models ?? []
  const outputName =
    saved && `${saved.source.replace(/\.gltf$/i, "") || "model"}.glb`
  const active = Boolean(selection || result)

  return (
    <section
      className={cn(
        "grid min-w-0 gap-3 rounded-lg",
        dragging && "ring-2 ring-ring"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        open(Array.from(event.dataTransfer.files))
      }}
    >
      <input hidden ref={input} multiple type="file" onChange={pickFiles} />
      <input
        hidden
        ref={folder}
        multiple
        type="file"
        {...{ webkitdirectory: "" }}
        onChange={pickFiles}
      />
      <Empty
        className={
          active
            ? "items-start gap-2 p-0"
            : "min-h-64 border border-dashed bg-muted/30"
        }
      >
        {!active && (
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArrowLeftRight aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              <span dir="ltr" className="font-mono">
                glTF → GLB
              </span>
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={saved && !missing ? "outline" : "default"}
            onClick={() => input.current?.click()}
          >
            {missing ? (
              <FolderPlus data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Folder data-icon="inline-start" aria-hidden="true" />
            )}
            {missing ? m.add : m.open}
          </Button>
          <Button variant="outline" onClick={() => folder.current?.click()}>
            <FolderInput data-icon="inline-start" aria-hidden="true" />
            {m.folder}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelection(undefined)
              setNoModel(false)
              void run()
            }}
          >
            {m.example}
          </Button>
        </div>
        {selection && models.length > 1 && (
          <label className="flex max-w-full flex-wrap items-center gap-2 text-sm">
            {m.chooseModel}
            <select
              className="h-9 max-w-full min-w-0 rounded-md border border-input bg-background px-2"
              value={models.indexOf(selection.model)}
              onChange={(event) =>
                pack({
                  ...selection,
                  model: models[Number(event.target.value)]!,
                })
              }
            >
              {models.map((model, index) => (
                <option key={index} value={index}>
                  {filePath(model)}
                </option>
              ))}
            </select>
          </label>
        )}
      </Empty>
      {status === "working" && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" />
          {m.packing}
        </p>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {missing && (
        <Alert>
          <AlertDescription>
            <p>{m.missing}</p>
            <p dir="auto" className="text-sm wrap-anywhere">
              {result?.file.name}
            </p>
            <ul className="list-inside list-disc font-mono">
              {missing.map((path) => {
                const label = displayPath(path)
                return (
                  <li key={path} className="wrap-anywhere">
                    <bdi title={label === path ? undefined : path}>{label}</bdi>
                  </li>
                )
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <p className="sr-only" role="status">
        {current?.kind === "ready" ? m.result : ""}
      </p>
      {saved && outputName && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 max-[360px]:basis-full">
            <Box
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {current?.kind === "ready" ? m.result : m.previous}
              </p>
              <p dir="auto" className="font-medium wrap-anywhere">
                {outputName}
              </p>
              <p
                dir="auto"
                className="text-xs wrap-anywhere text-muted-foreground"
              >
                {saved.source}
              </p>
            </div>
          </div>
          <DocumentDownload
            file={saved.glb}
            filename={outputName}
            label={m.download}
          />
        </div>
      )}
    </section>
  )
}
