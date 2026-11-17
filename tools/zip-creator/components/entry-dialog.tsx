import { useId, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Folder } from "@workspace/ui/icons"

import { itemName, parentPath } from "../core/collection"
import { canMove } from "../core/edit"
import { DirectoryNav } from "./directory-nav"

import type { EditAction, EditError, Messages } from "../types"
import type { Creator } from "../use-zip-creator"

export type EntryAction =
  | { kind: "new-folder" }
  | { kind: "rename" | "move"; path: string }

export function EntryDialog({
  action,
  creator: c,
  messages: m,
  onClose,
  onRestoreFocus,
}: {
  action: EntryAction
  creator: Creator
  messages: Messages
  onClose: () => void
  onRestoreFocus: () => void
}) {
  const moving = action.kind === "move"
  const [name, setName] = useState(
    action.kind === "new-folder" ? "" : itemName(action.path)
  )
  const [destination, setDestination] = useState(
    action.kind === "new-folder" ? c.directory : parentPath(action.path)
  )
  const [error, setError] = useState<EditError | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const id = useId()
  const title = moving
    ? m.move
    : action.kind === "rename"
      ? m.rename
      : m.newFolder
  const folders = (c.index.directories.get(destination) ?? []).filter(
    (item) => !item.file && (!moving || canMove(action.path, item.path))
  )

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={content}
        closeLabel={m.cancel}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onRestoreFocus()
        }}
        onOpenAutoFocus={(event) => {
          // Keep mobile keyboards closed until the user taps the field.
          if (window.matchMedia("(pointer: coarse)").matches) {
            event.preventDefault()
            content.current?.focus()
          } else if (input.current) {
            event.preventDefault()
            input.current.focus()
            input.current.select()
          }
        }}
      >
        <form
          className="flex min-w-0 flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            const edit: EditAction =
              action.kind === "new-folder"
                ? { kind: action.kind, directory: c.directory, name }
                : moving
                  ? { kind: "move", path: action.path, directory: destination }
                  : { kind: "rename", path: action.path, name }
            const issue = c.edit(edit)
            setError(issue)
            if (issue) input.current?.focus()
            else onClose()
          }}
        >
          <DialogHeader className="text-start sm:text-start">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{m.editDescription}</DialogDescription>
          </DialogHeader>
          {action.kind !== "new-folder" ? (
            <bdi className="truncate text-sm font-medium" title={action.path}>
              {itemName(action.path)}
            </bdi>
          ) : null}
          <FieldGroup>
            <Field
              data-invalid={Boolean(error)}
              aria-labelledby={moving ? id : undefined}
            >
              {moving ? (
                <>
                  <FieldLabel id={id} asChild>
                    <span>{m.destination}</span>
                  </FieldLabel>
                  <DirectoryNav
                    directory={destination}
                    disabled={false}
                    messages={m}
                    onNavigate={(path) => {
                      setDestination(path)
                      setError(null)
                    }}
                  />
                  <div className="flex max-h-48 flex-col overflow-y-auto overscroll-contain rounded-lg border p-1">
                    {folders.length ? (
                      folders.map((folder) => (
                        <Button
                          key={folder.path}
                          type="button"
                          variant="ghost"
                          className="h-11 min-w-0 justify-start"
                          title={folder.path}
                          onClick={() => {
                            setDestination(folder.path)
                            setError(null)
                          }}
                        >
                          <Folder aria-hidden="true" data-icon="inline-start" />
                          <bdi className="truncate">
                            {itemName(folder.path)}
                          </bdi>
                        </Button>
                      ))
                    ) : (
                      <p className="p-3 text-sm text-muted-foreground">
                        {m.noFolders}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <FieldLabel htmlFor={id}>{m.name}</FieldLabel>
                  <Input
                    ref={input}
                    id={id}
                    name="entry-name"
                    autoComplete="off"
                    spellCheck={false}
                    value={name}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onChange={(event) => {
                      setName(event.target.value)
                      setError(null)
                    }}
                  />
                </>
              )}
              {error ? (
                <FieldError id={`${id}-error`}>{m[error]}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="min-h-11">
                {m.cancel}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="min-h-11"
              disabled={moving && destination === parentPath(action.path)}
            >
              {moving
                ? m.moveHere
                : action.kind === "new-folder"
                  ? m.newFolder
                  : m.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
