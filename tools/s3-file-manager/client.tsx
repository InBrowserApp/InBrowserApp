import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  Database,
  MoreHorizontal,
  HardDrive,
  Pencil,
  Plus,
  Trash2,
  Wrench,
} from "@workspace/ui/icons"

import { Connected } from "./connected"
import { ConnectionDialog } from "./connection-dialog"
import { CorsDialog, FormActions, Modal } from "./dialogs"
import { corsRule, readConnections, saveConnections } from "./model"

import type { Connection, Labels } from "./model"

export default function S3FileManager({
  messages: labels,
  lang,
}: {
  messages: Labels
  lang: string
}) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [activeId, setActiveId] = useState("")
  const [dialog, setDialog] = useState<"add" | "edit" | "remove" | "cors">()
  const [error, setError] = useState("")
  const [origin, setOrigin] = useState("https://inbrowser.app")
  const [revision, setRevision] = useState(0)
  const active = connections.find(({ id }) => id === activeId)
  const close = () => setDialog(undefined)

  useEffect(() => {
    setOrigin(window.location.origin)
    try {
      const saved = readConnections(window.localStorage)
      setConnections(saved)
      setActiveId(saved[0]?.id ?? "")
    } catch {
      setError(labels.storageFailed)
    }
  }, [labels.storageFailed])

  function persist(next: Connection[]) {
    setConnections(next)
    setError("")
    try {
      saveConnections(window.localStorage, next)
    } catch {
      setError(labels.storageFailed)
    }
    setRevision((current) => current + 1)
    close()
  }

  function save(connection: Connection) {
    persist(
      active && dialog === "edit"
        ? connections.map((item) =>
            item.id === connection.id ? connection : item
          )
        : [...connections, connection]
    )
    setActiveId(connection.id)
  }

  return (
    <>
      <section className="grid overflow-hidden rounded-xl border bg-card shadow-xs md:min-h-[26rem] md:grid-cols-[minmax(12rem,15rem)_minmax(0,1fr)]">
        <aside className="min-w-0 border-b bg-muted/30 p-3 md:border-e md:border-b-0 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <HardDrive className="size-4 text-muted-foreground" />
              {labels.connections}
            </h2>
            <Button
              aria-label={labels.addConnection}
              title={labels.addConnection}
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setDialog("add")}
            >
              <Plus />
            </Button>
          </div>
          {active && (
            <div className="mt-3 flex min-w-0 items-center gap-1">
              <select
                aria-label={labels.connections}
                value={activeId}
                onChange={(event) => setActiveId(event.target.value)}
                className="h-9 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm"
              >
                {connections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.name}
                  </option>
                ))}
              </select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={labels.actions}
                    title={labels.actions}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setDialog("edit")}>
                    <Pencil />
                    {labels.editConnection}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setDialog("remove")}
                  >
                    <Trash2 />
                    {labels.removeConnection}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button
            className="mt-3 w-full justify-start px-2 text-muted-foreground"
            variant="ghost"
            size="sm"
            onClick={() => setDialog("cors")}
          >
            <Wrench />
            {labels.corsHelp}
          </Button>
          {error && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </aside>
        {active?.credentials ? (
          <Connected
            key={active.id + ":" + revision}
            connection={active}
            labels={labels}
            lang={lang}
            edit={() => setDialog("edit")}
          />
        ) : (
          <div className="grid min-h-72 place-items-center p-5 text-center">
            <div className="grid w-full max-w-sm min-w-0 justify-items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl border bg-muted text-primary">
                <Database className="size-6" />
              </div>
              <h2 className="font-heading text-xl font-semibold wrap-anywhere">
                {active ? <bdi>{active.name}</bdi> : labels.emptyTitle}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {active ? labels.credentialsRequired : labels.emptyBody}
              </p>
              <Button onClick={() => setDialog(active ? "edit" : "add")}>
                {active ? <Pencil /> : <Plus />}
                {active ? labels.editConnection : labels.addConnection}
              </Button>
            </div>
          </div>
        )}
      </section>
      {(dialog === "add" || dialog === "edit") && (
        <ConnectionDialog
          labels={labels}
          connection={dialog === "edit" ? active : undefined}
          close={close}
          save={save}
        />
      )}
      {dialog === "remove" && active && (
        <Modal
          title={labels.removeConnection}
          description={labels.removeConnectionPrompt.replace(
            "{name}",
            () => active.name
          )}
          labels={labels}
          close={close}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const next = connections.filter(({ id }) => id !== active.id)
              persist(next)
              setActiveId(next[0]?.id ?? "")
            }}
          >
            <FormActions
              labels={labels}
              close={close}
              action={labels.removeConnection}
              destructive
            />
          </form>
        </Modal>
      )}
      {dialog === "cors" && (
        <CorsDialog labels={labels} rule={corsRule(origin)} close={close} />
      )}
    </>
  )
}
