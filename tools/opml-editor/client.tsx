import { useId, useMemo, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { FolderPlus, ListTree, Rss, Undo2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { ItemEditor } from "./item-editor"
import { OutlineList } from "./outline-list"
import { EditorToolbar } from "./editor-toolbar"
import {
  addOutline,
  documentTitle,
  isFeed,
  newOutline,
  outlineRows,
  parseOpml,
  readOpmlFile,
  serializeOpml,
  setDocumentTitle,
} from "./xml"
import type { OpmlDocument } from "./xml"
import type { Messages } from "./types"

type RemovedItem = { node: Element; parent: Element; before: ChildNode | null }
const desktop = "(min-width: 48rem)"

export default function Client({ messages: m }: { messages: Messages }) {
  const [model, setModel] = useState<OpmlDocument | null>(null)
  const [selected, setSelected] = useState<Element | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [removed, setRemoved] = useState<RemovedItem | null>(null)
  const [fileError, setFileError] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const outline = useRef<HTMLDivElement>(null)
  const load = useRef(0)
  const titleId = useId()
  const title = model ? documentTitle(model) : ""
  const rows = useMemo(() => (model ? outlineRows(model) : []), [model])
  const missingFeed = rows.some(
    ({ node }) => isFeed(node) && !node.getAttribute("xmlUrl")?.trim()
  )
  const exported = useMemo(
    () => (model && !missingFeed ? serializeOpml(model) : ""),
    [model, missingFeed]
  )

  function apply(next: OpmlDocument | null) {
    setModel(next)
    setSelected(null)
    setShowDetails(false)
    setRemoved(null)
    setFileError(false)
  }
  function readText(text: string) {
    try {
      const next = parseOpml(text)
      load.current++
      apply(next)
      return true
    } catch {
      return false
    }
  }
  async function openFile(file: File) {
    const current = ++load.current
    setFileError(false)
    try {
      const next = await readOpmlFile(file)
      if (current === load.current) apply(next)
    } catch {
      if (current === load.current) setFileError(true)
    }
  }
  function edit(change: (doc: OpmlDocument) => void) {
    const doc = model ?? newOutline()
    change(doc)
    setModel({ ...doc })
  }
  function select(node: Element, keyboard: boolean) {
    setSelected(node)
    setShowDetails(true)
    if (keyboard || !window.matchMedia(desktop).matches)
      requestAnimationFrame(() => heading.current?.focus())
  }
  function add(feed: boolean) {
    edit((doc) =>
      select(
        addOutline(doc, selected, feed ? m.newFeed : m.newFolder, feed),
        true
      )
    )
  }
  function remove() {
    if (!selected) return
    setRemoved({
      node: selected,
      parent: selected.parentElement!,
      before: selected.nextSibling,
    })
    edit(() => selected.remove())
    setSelected(null)
    setShowDetails(false)
  }
  function undo() {
    if (!removed) return
    const { node, parent, before } = removed
    edit(() =>
      parent.insertBefore(node, before?.parentNode === parent ? before : null)
    )
    setRemoved(null)
    select(node, true)
  }
  return (
    <section
      data-tool="opml-editor"
      className="overflow-hidden rounded-xl border"
      aria-label={m.outline}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) event.preventDefault()
      }}
      onDrop={(event) => {
        const file = event.dataTransfer.files[0]
        if (!file) return
        event.preventDefault()
        void openFile(file)
      }}
    >
      <EditorToolbar
        messages={m}
        loaded={Boolean(model)}
        title={title}
        exported={exported}
        openFile={openFile}
        readText={readText}
        reset={() => {
          load.current++
          apply(null)
        }}
      />
      {fileError && (
        <div className="border-b p-3">
          <Alert variant="destructive">
            <AlertDescription role="alert">{m.invalid}</AlertDescription>
          </Alert>
        </div>
      )}
      {missingFeed && (
        <p
          role="status"
          className="border-b px-4 py-2 text-sm text-muted-foreground"
        >
          {m.feedRequired}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:gap-3">
        <Label htmlFor={titleId}>{m.title}</Label>
        <Input
          id={titleId}
          dir="auto"
          className="w-full sm:max-w-80"
          value={title}
          onChange={(event) =>
            edit((doc) => setDocumentTitle(doc, event.target.value))
          }
        />
      </div>
      <div className="grid md:grid-cols-2">
        <div
          ref={outline}
          className={cn(
            "min-w-0 flex-col md:flex md:border-e",
            showDetails ? "hidden" : "flex"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
            <h2 className="text-base font-semibold">{m.outline}</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => add(false)}>
                <FolderPlus data-icon="inline-start" aria-hidden="true" />
                {m.addFolder}
              </Button>
              <Button size="sm" variant="outline" onClick={() => add(true)}>
                <Rss data-icon="inline-start" aria-hidden="true" />
                {m.addFeed}
              </Button>
            </div>
          </div>
          {rows.length ? (
            <OutlineList
              rows={rows}
              selected={selected}
              onSelect={select}
              messages={m}
            />
          ) : (
            <div className="m-auto flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <ListTree className="size-6" aria-hidden="true" />
              <p>{m.empty}</p>
              {!model && <p className="text-xs">{m.fileHint}</p>}
            </div>
          )}
        </div>
        <div
          className={cn("min-w-0 md:block", showDetails ? "block" : "hidden")}
        >
          {selected && model ? (
            <ItemEditor
              node={selected}
              body={model.body}
              messages={m}
              heading={heading}
              onEdit={edit}
              onRemove={remove}
              onBack={() => {
                setShowDetails(false)
                requestAnimationFrame(() =>
                  outline.current
                    ?.querySelector<HTMLButtonElement>('[aria-current="true"]')
                    ?.focus()
                )
              }}
            />
          ) : (
            <p className="grid h-full min-h-48 place-content-center p-6 text-center text-sm text-muted-foreground">
              {m.choose}
            </p>
          )}
        </div>
      </div>
      {removed && (
        <div className="flex items-center justify-between gap-2 border-t px-4 py-2 text-sm">
          <p role="status">{m.removed}</p>
          <Button size="sm" variant="outline" onClick={undo}>
            <Undo2 data-icon="inline-start" aria-hidden="true" />
            {m.undo}
          </Button>
        </div>
      )}
    </section>
  )
}
