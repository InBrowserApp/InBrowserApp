import { useEffect, useId, useRef, useState } from "react"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@workspace/ui/components/ui/select"
import { ArrowLeftRight, Copy, Check, Eye } from "@workspace/ui/icons"
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
  const root = useRef<HTMLDivElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  const address = state.selection?.reference ?? ""
  const [reference, setReference] = useState(address)
  const [details, setDetails] = useState(false)
  useEffect(() => {
    setReference(address)
  }, [address, state.selection])
  const status = state.switching
    ? m.loading
    : state.copyStatus === "failed"
      ? m.copyFailed
      : state.selection?.noCachedValue
        ? m.noCachedValue
        : state.empty
          ? m.empty
          : ""
  return (
    <div ref={root} className="flex shrink-0 flex-col gap-2 border-b p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-32 flex-1 sm:hidden">
          <Select
            value={String(state.sheet)}
            onValueChange={(value) => reader.sheet(Number(value))}
          >
            <SelectTrigger aria-label={m.sheet} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent container={portal}>
              <SelectGroup>
                {state.sheets.map((sheet, index) => (
                  <SelectItem key={index} value={String(index)}>
                    <span dir="auto">
                      {sheet.name}
                      {sheet.hidden ? ` (${m.hidden})` : ""}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <DocumentZoom
            value={state.zoom}
            onChange={reader.zoom}
            messages={m}
          />
          <DocumentIconButton
            label={m.fit}
            onClick={() => reader.zoom("page-width")}
          >
            <ArrowLeftRight aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={state.copyStatus === "copied" ? m.copied : m.copy}
            disabled={!state.selection || state.switching}
            onClick={() => reader.copy()}
          >
            {state.copyStatus === "copied" ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
          </DocumentIconButton>
        </div>
      </div>
      <div className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-start gap-2">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const input = event.currentTarget.querySelector("input")!
            if (!isCellReference(reference)) {
              input.setCustomValidity(`${m.range}: A1–XFD1048576`)
              input.reportValidity()
              return
            }
            reader.go(reference.toUpperCase())
            setReference(address)
          }}
        >
          <Input
            aria-label={m.range}
            title={m.range}
            value={reference}
            maxLength={10}
            placeholder="A1"
            dir="ltr"
            disabled={state.switching}
            onChange={(event) => {
              event.target.setCustomValidity("")
              setReference(event.target.value)
            }}
            onBlur={(event) => {
              event.target.setCustomValidity("")
              setReference(address)
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && reference !== address) {
                event.preventDefault()
                event.stopPropagation()
                event.currentTarget.setCustomValidity("")
                setReference(address)
              }
            }}
          />
        </form>
        <div className="flex min-w-0 flex-col gap-1">
          <Input
            aria-label={m.value}
            value={state.selection?.value ?? ""}
            readOnly
            dir="auto"
          />
          <Input
            aria-label={m.formula}
            value={state.selection?.formula ?? ""}
            placeholder={m.formula}
            readOnly
            dir="ltr"
            className="h-7"
          />
        </div>
        <DocumentIconButton
          label={m.details}
          aria-expanded={details}
          aria-controls={`${id}-details`}
          onClick={() => setDetails((open) => !open)}
        >
          <Eye aria-hidden="true" />
        </DocumentIconButton>
      </div>
      {details ? (
        <div
          id={`${id}-details`}
          className="grid max-h-48 gap-2 overflow-auto sm:grid-cols-2"
        >
          <Textarea
            aria-label={`${m.details}: ${m.value}`}
            value={state.selection?.value ?? ""}
            readOnly
            rows={3}
            dir="auto"
          />
          <Textarea
            aria-label={`${m.details}: ${m.formula}`}
            value={state.selection?.formula ?? ""}
            readOnly
            rows={3}
            dir="ltr"
          />
        </div>
      ) : null}
      <p
        role="status"
        title={status}
        className={
          status
            ? "max-h-16 overflow-auto text-xs text-muted-foreground"
            : "sr-only"
        }
      >
        {status}
      </p>
    </div>
  )
}
