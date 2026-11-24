import { useId, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Terminal } from "@workspace/ui/icons"

import { encodeSend } from "./core/data"
import { SessionLog, selectClass } from "./session-log"
import { useTerminal } from "./use-terminal"

import type { DataFormat, LineEnding } from "./core/data"
import type english from "./messages/en.json"

const rates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600]
const endings = [
  { value: "none", label: null },
  { value: "lf", label: "LF" },
  { value: "cr", label: "CR" },
  { value: "crlf", label: "CR + LF" },
] as const

export default function SerialTerminal({
  language,
  messages,
}: {
  language: string
  messages: typeof english
}) {
  const terminal = useTerminal()
  const [baud, setBaud] = useState("115200")
  const [format, setFormat] = useState<DataFormat>("text")
  const [ending, setEnding] = useState<LineEnding>("lf")
  const [input, setInput] = useState("")
  const rateList = useId()
  const connectionErrorId = useId()
  const sendErrorId = useId()
  const baudRate = Number(baud)
  const validBaud = /^\d+$/.test(baud) && baudRate > 0 && baudRate <= 0xffffffff
  const bytes = encodeSend(input, format, ending)
  const { phase, supported, failure, entries, truncated, sending } = terminal
  const connected = phase === "connected"
  const busy = phase === "connecting" || phase === "disconnecting"
  const canSend = connected && !sending && bytes !== null && bytes.length > 0
  const errorMessage = !validBaud
    ? messages.invalidBaud
    : failure && messages[failure]
  const action = {
    disconnected: messages.connect,
    connecting: messages.connecting,
    connected: messages.disconnect,
    disconnecting: messages.disconnecting,
  }[phase]

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
        <label className="grid gap-1.5 text-sm font-medium">
          {messages.baudRate}
          <Input
            className="w-32 font-mono tabular-nums"
            dir="ltr"
            inputMode="numeric"
            list={rateList}
            value={baud}
            onChange={(event) => setBaud(event.target.value)}
            disabled={phase !== "disconnected"}
            aria-invalid={!validBaud}
            aria-describedby={!validBaud ? connectionErrorId : undefined}
          />
          <datalist id={rateList}>
            {rates.map((rate) => (
              <option key={rate} value={rate} />
            ))}
          </datalist>
        </label>
        <Button
          type="button"
          variant={connected ? "outline" : "default"}
          disabled={!supported || busy || !validBaud}
          onClick={() =>
            void (connected
              ? terminal.disconnect()
              : terminal.connect(baudRate))
          }
        >
          <Terminal aria-hidden="true" />
          {action}
        </Button>
        <div
          role="status"
          className="ms-auto flex min-h-9 items-center gap-2 text-sm text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "bg-muted-foreground/50"}`}
          />
          {connected
            ? messages.connected
            : busy
              ? action
              : messages.disconnected}
        </div>
        {supported === false && (
          <p className="basis-full text-sm text-muted-foreground">
            {messages.unsupported}
          </p>
        )}
        {errorMessage && (
          <p
            id={connectionErrorId}
            role="alert"
            className="basis-full text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <SessionLog
        language={language}
        messages={messages}
        entries={entries}
        truncated={truncated}
        clear={terminal.clear}
        getLog={terminal.getLog}
      />

      <form
        className="space-y-3 rounded-xl border bg-card p-4"
        onSubmit={async (event) => {
          event.preventDefault()
          if (canSend && (await terminal.send(bytes))) {
            setInput((current) => (current === input ? "" : current))
          }
        }}
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1.5 text-sm font-medium">
            {messages.sendMode}
            <select
              className={selectClass}
              value={format}
              onChange={(event) => setFormat(event.target.value as DataFormat)}
            >
              <option value="text">{messages.text}</option>
              <option value="hex">{messages.hex}</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            {messages.lineEnding}
            <select
              className={selectClass}
              disabled={format === "hex"}
              value={ending}
              onChange={(event) => setEnding(event.target.value as LineEnding)}
            >
              {endings.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label ?? messages.none}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid min-w-40 flex-1 gap-1.5 text-sm font-medium">
            {messages.input}
            <Input
              className="font-mono"
              dir="ltr"
              autoComplete="off"
              spellCheck={false}
              maxLength={8192}
              value={input}
              aria-invalid={input.length > 0 && bytes === null}
              aria-describedby={
                input.length > 0 && bytes === null ? sendErrorId : undefined
              }
              onChange={(event) => setInput(event.target.value)}
            />
          </label>
          <Button type="submit" disabled={!canSend}>
            {messages.send}
          </Button>
        </div>
        {input.length > 0 && bytes === null && (
          <p id={sendErrorId} className="text-sm text-destructive">
            {messages.invalidHex}
          </p>
        )}
      </form>
    </section>
  )
}
