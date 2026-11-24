import { useId, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { ArrowLeftRight, Sparkles } from "@workspace/ui/icons"
import {
  findSystem,
  project,
  systemLabel,
  systems,
  webMercator,
  wgs84,
  type System,
} from "./core/systems"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const first = systemLabel(wgs84)
const second = systemLabel(webMercator)

function CoordinatePanel({
  title,
  system,
  query,
  onQuery,
  values,
  onValue,
  messages,
  list,
}: {
  title: string
  system: System | undefined
  query: string
  onQuery: (value: string) => void
  values: [string, string]
  onValue?: (axis: number, value: string) => void
  messages: Messages
  list: string
}) {
  const [searching, setSearching] = useState(false)
  const labels = system?.geographic
    ? [messages.longitude, messages.latitude]
    : [messages.easting, messages.northing]
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          <span className="sr-only">{title}</span>
          <Input
            dir="ltr"
            list={list}
            value={query}
            placeholder={messages.search}
            onChange={(event) => onQuery(event.target.value)}
            onFocus={(event) => {
              setSearching(true)
              event.target.select()
            }}
            onBlur={() => {
              setSearching(false)
              if (system) onQuery(systemLabel(system))
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        {!searching && !system && query.trim() && (
          <p className="text-sm text-muted-foreground">{messages.noSystems}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {labels.map((label, axis) => (
            <label key={label} className="grid gap-1.5 text-sm font-medium">
              <span>
                {label}
                {system && !system.geographic && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {messages.meters}
                  </span>
                )}
              </span>
              <Input
                dir="ltr"
                inputMode="decimal"
                className="font-mono"
                value={values[axis]}
                placeholder="—"
                readOnly={!onValue}
                onChange={
                  onValue && ((event) => onValue(axis, event.target.value))
                }
              />
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Client({ messages }: Readonly<{ messages: Messages }>) {
  const list = useId()
  const [source, setSource] = useState(first)
  const [target, setTarget] = useState(second)
  const [input, setInput] = useState<[string, string]>(["", ""])
  const from = findSystem(source)
  const to = findSystem(target)
  const ready = from && to && input.every((value) => value.trim() !== "")
  const output = ready ? project(from, to, ...input) : undefined

  return (
    <div className="grid gap-4">
      <datalist id={list}>
        {systems.map((system) => (
          <option key={system.code} value={systemLabel(system)} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSource(first)
            setTarget(second)
            setInput(["139.76709", "35.68124"])
          }}
        >
          <Sparkles aria-hidden="true" />
          {messages.example}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!from || !to || (input.some(Boolean) && !output)}
          onClick={() => {
            setSource(target)
            setTarget(source)
            setInput(output ?? ["", ""])
          }}
        >
          <ArrowLeftRight aria-hidden="true" />
          {messages.swap}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CoordinatePanel
          title={messages.source}
          system={from}
          query={source}
          onQuery={setSource}
          values={input}
          onValue={(axis, value) =>
            setInput((current) =>
              axis === 0 ? [value, current[1]] : [current[0], value]
            )
          }
          messages={messages}
          list={list}
        />
        <CoordinatePanel
          title={messages.target}
          system={to}
          query={target}
          onQuery={setTarget}
          values={output ?? ["", ""]}
          messages={messages}
          list={list}
        />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{messages.axisHelp}</p>
        <ToolCopyButton
          value={output?.join(", ") ?? ""}
          copyLabel={messages.copy}
          copiedLabel={messages.copied}
        />
      </div>
      {ready && !output && (
        <p role="status" className="text-sm text-destructive">
          {messages.invalid}
        </p>
      )}
    </div>
  )
}
