import { useId, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ArrowRight,
  Camera,
  Download,
  Network,
  Upload,
  X,
} from "@workspace/ui/icons"
import { PairingQr, QrScanner } from "./qr"
import type { Messages } from "./types"
import type { useConnection } from "./use-connection"

type Connection = ReturnType<typeof useConnection>

function PairingInput({
  messages: m,
  reply,
  pending,
  submit,
}: Readonly<{
  messages: Messages
  reply: boolean
  pending: boolean
  submit: (code: string) => Promise<void>
}>) {
  const id = useId()
  const [input, setInput] = useState("")
  const [camera, setCamera] = useState<"idle" | "scanning" | "failed">("idle")
  const scanning = camera === "scanning"

  return (
    <form
      className="grid min-w-0 content-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setCamera("idle")
        void submit(input)
      }}
    >
      <h2 className="text-lg font-semibold">
        {reply ? m.readReply : m.readInvite}
      </h2>
      <fieldset disabled={pending} className="grid min-w-0 gap-4">
        <Button
          type="button"
          variant="secondary"
          className="h-auto min-h-10 justify-start whitespace-normal"
          aria-expanded={scanning}
          onClick={() => setCamera(scanning ? "idle" : "scanning")}
        >
          {scanning ? <X aria-hidden="true" /> : <Camera aria-hidden="true" />}
          {scanning ? m.stopScan : m.scan}
        </Button>
        {scanning && (
          <QrScanner
            label={m.scan}
            onRead={(value) => {
              setCamera("idle")
              setInput(value)
              void submit(value)
            }}
            onError={() => setCamera("failed")}
          />
        )}
        {camera === "failed" && (
          <p role="status" className="text-sm text-muted-foreground">
            {m.cameraError}
          </p>
        )}
        <div className="grid gap-2">
          <label htmlFor={id} className="text-sm font-medium">
            {reply ? m.replyInput : m.inviteInput}
          </label>
          <Textarea
            id={id}
            dir="ltr"
            rows={2}
            className="min-h-0 resize-y font-mono"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          className="justify-self-start"
          disabled={!input.trim()}
        >
          {m.continue}
          <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
        </Button>
      </fieldset>
      {pending && (
        <p role="status" className="text-sm text-muted-foreground">
          {reply ? m.connecting : m.preparing}
        </p>
      )}
    </form>
  )
}

export function PairingPanel({
  messages: m,
  connection: c,
}: Readonly<{ messages: Messages; connection: Connection }>) {
  if (c.phase === "home") {
    return (
      <div className="grid gap-5 p-5 sm:p-7">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Network
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          {m.sameNetwork}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: m.startSending,
              help: m.sendHelp,
              Icon: Upload,
              action: () => {
                void c.begin()
              },
              primary: true,
            },
            {
              title: m.startReceiving,
              help: m.receiveHelp,
              Icon: Download,
              action: c.receive,
              primary: false,
            },
          ].map(({ title, help, Icon, action, primary }) => (
            <button
              key={title}
              type="button"
              onClick={action}
              className={`grid content-start gap-3 rounded-xl border p-5 text-start transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${primary ? "border-primary/25 bg-primary/5 hover:bg-primary/10" : "bg-background hover:bg-muted"}`}
            >
              <span
                className={`grid size-10 place-items-center rounded-lg ${primary ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="grid gap-1">
                <span className="text-base font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{help}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const invite = c.phase === "invite"
  const reply = c.phase === "reply"
  const showingCode = invite || reply
  const codeLabel = invite ? m.inviteInput : m.replyInput
  const codeTitle = invite ? m.inviteTitle : m.replyTitle

  return (
    <div className="grid gap-5 p-5 sm:p-7">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="justify-self-start"
        onClick={() => c.reset()}
      >
        <ArrowRight aria-hidden="true" className="rotate-180 rtl:rotate-0" />
        {m.back}
      </Button>
      <div className={invite ? "grid gap-6 sm:grid-cols-2" : "grid gap-6"}>
        {showingCode && (
          <div className="grid min-w-0 content-start justify-items-start gap-3">
            <h2 className="text-lg font-semibold">{codeTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {invite
                ? c.resumeFile || c.receivingFile
                  ? `${m.resumeHelp} ${m.receiveHelp}`
                  : m.inviteHelp
                : m.replyHelp}
            </p>
            <PairingQr key={c.code} value={c.code} label={codeTitle} />
            <ToolCopyButton
              value={c.code}
              copyLabel={invite ? m.copyInvite : m.copyReply}
              copiedLabel={m.copied}
              failedLabel={m.copyFailed}
              className="h-auto min-h-8 whitespace-normal"
            />
            <details className="w-full min-w-0 text-sm text-muted-foreground">
              <summary className="w-fit cursor-pointer rounded-sm">
                {codeLabel}
              </summary>
              <Textarea
                aria-label={codeLabel}
                dir="ltr"
                readOnly
                rows={2}
                className="mt-2 min-h-0 font-mono"
                value={c.code}
                onFocus={(event) => event.currentTarget.select()}
              />
            </details>
          </div>
        )}
        {(invite || c.phase === "receive") && (
          <PairingInput
            messages={m}
            reply={invite}
            pending={c.pending}
            submit={invite ? c.reply : c.begin}
          />
        )}
        {!(showingCode || c.phase === "receive") && (
          <p role="status" className="text-sm text-muted-foreground">
            {c.phase === "preparing" ? m.preparing : m.connecting}
          </p>
        )}
      </div>
    </div>
  )
}
