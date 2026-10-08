import { useId, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { Input } from "@workspace/ui/components/ui/input"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/ui/select"
import { Copy, Check } from "@workspace/ui/icons"
import { isCellReference } from "../core/cells"
import type { Messages, Reader, ReaderState } from "../types"

export function Toolbar({
  messages: m,
  state,
  reader,
}: {
  messages: Messages
  state: ReaderState
  reader: Reader
}) {
  const id = useId()
  const [reference, setReference] = useState("A1")
  return (
    <div className="flex flex-col gap-3 border-b p-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field className="min-w-40 flex-1">
          <FieldLabel htmlFor={`${id}-sheet`}>{m.sheet}</FieldLabel>
          <Select
            value={String(state.sheet)}
            onValueChange={(value) => reader.sheet(Number(value))}
          >
            <SelectTrigger id={`${id}-sheet`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.sheets.map((sheet, index) => (
                <SelectItem key={index} value={String(index)}>
                  <span dir="auto">
                    {sheet.name}
                    {sheet.hidden ? ` (${m.hidden})` : ""}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-24">
          <FieldLabel htmlFor={`${id}-zoom`}>{m.zoom}</FieldLabel>
          <DocumentNumberInput
            id={`${id}-zoom`}
            min={25}
            max={400}
            step={25}
            value={state.zoom}
            onCommit={reader.zoom}
          />
        </Field>
        <Button variant="outline" onClick={() => reader.zoom("page-width")}>
          {m.fit}
        </Button>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const input = event.currentTarget.querySelector("input")!
            if (!isCellReference(reference)) {
              input.setCustomValidity(`${m.range}: A1–XFD1048576`)
              input.reportValidity()
              return
            }
            reader.go(reference.toUpperCase())
          }}
        >
          <Field className="w-36">
            <FieldLabel htmlFor={`${id}-reference`}>{m.range}</FieldLabel>
            <Input
              id={`${id}-reference`}
              value={reference}
              maxLength={10}
              placeholder="A1"
              dir="ltr"
              onChange={(event) => {
                event.target.setCustomValidity("")
                setReference(event.target.value)
              }}
            />
          </Field>
          <Button type="submit" variant="outline" disabled={state.switching}>
            {m.go}
          </Button>
        </form>
        <Button
          variant="outline"
          disabled={!state.selection || state.switching}
          onClick={() => reader.copy()}
        >
          {state.copyStatus === "copied" ? <Check /> : <Copy />}
          {state.copyStatus === "copied" ? m.copied : m.copy}
        </Button>
      </div>
      {state.selection ? (
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3">
          <Field>
            <FieldLabel htmlFor={`${id}-cell`}>{m.cell}</FieldLabel>
            <Input
              id={`${id}-cell`}
              value={state.selection.reference}
              readOnly
              dir="ltr"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-value`}>{m.value}</FieldLabel>
            <Input
              id={`${id}-value`}
              value={state.selection.value}
              readOnly
              dir="auto"
            />
          </Field>
          {state.selection.formula ? (
            <Field className="col-span-2">
              <FieldLabel htmlFor={`${id}-formula`}>{m.formula}</FieldLabel>
              <Input
                id={`${id}-formula`}
                value={state.selection.formula}
                readOnly
                dir="ltr"
              />
            </Field>
          ) : null}
        </div>
      ) : null}
      <p role="status" className="text-xs text-muted-foreground">
        {state.switching
          ? m.loading
          : state.copyStatus === "failed"
            ? m.copyFailed
            : state.selection?.noCachedValue
              ? m.noCachedValue
              : state.empty
                ? m.empty
                : m.privacy}
      </p>
    </div>
  )
}
