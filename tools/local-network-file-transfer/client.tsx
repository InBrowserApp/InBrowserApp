import { useEffect, useEffectEvent, useState } from "react"
import { TriangleAlert } from "@workspace/ui/icons"
import { inviteFromHash } from "./pairing"
import { PairingPanel } from "./pairing-panel"
import { ReceivedPanel, TransferPanel } from "./transfer-panel"
import { useConnection } from "./use-connection"
import type { Messages } from "./types"

export default function LocalTransferClient({
  messages,
}: Readonly<{ messages: Messages }>) {
  const connection = useConnection()
  const [file, setFile] = useState<File>()
  const [text, setText] = useState("")
  const [mode, setMode] = useState<"file" | "text">("file")
  const { error, phase, receivedFiles, receivedText } = connection
  const canResume = connection.resumeFile || connection.receivingFile
  const begin = useEffectEvent(connection.begin)

  useEffect(() => {
    const invitation = inviteFromHash(location.hash)
    if (invitation) void begin(invitation)
  }, [])

  return (
    <div className="grid gap-3">
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          {messages[error]}
        </p>
      )}
      {canResume && (phase === "home" || phase === "receive") && (
        <p className="text-sm text-muted-foreground">{messages.resumeHelp}</p>
      )}
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-muted/20">
        {phase === "connected" ? (
          <TransferPanel
            messages={messages}
            connection={connection}
            draft={{ file, setFile, text, setText, mode, setMode }}
          />
        ) : (
          <PairingPanel messages={messages} connection={connection} />
        )}
        {(receivedFiles.length > 0 || receivedText !== undefined) && (
          <ReceivedPanel messages={messages} connection={connection} />
        )}
      </div>
    </div>
  )
}
