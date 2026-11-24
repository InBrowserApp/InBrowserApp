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
  const { error, phase, receivedFile, receivedText } = connection
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
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-muted/20">
        {phase === "connected" ? (
          <TransferPanel
            messages={messages}
            connection={connection}
            draft={{ file, setFile, text, setText }}
          />
        ) : (
          <PairingPanel messages={messages} connection={connection} />
        )}
        {(receivedFile || receivedText !== undefined) && (
          <ReceivedPanel messages={messages} connection={connection} />
        )}
      </div>
    </div>
  )
}
