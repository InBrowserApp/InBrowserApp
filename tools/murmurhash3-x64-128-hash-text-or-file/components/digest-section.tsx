import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import type { MurmurHash3HashTextOrFilePageMessages } from "../client/types"
import type { MurmurHash3Digest } from "../core/murmurhash3"
import { HashOutputGrid } from "./hash-output-grid"

type MurmurHash3DigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: MurmurHash3Digest }
  | { status: "error"; message: string }

function DigestSection({
  state,
  messages,
}: Readonly<{
  state: MurmurHash3DigestState
  messages: MurmurHash3HashTextOrFilePageMessages
}>) {
  if (state.status === "idle") {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {messages.plainTextDescription}
      </div>
    )
  }

  return (
    <section className="grid gap-4">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "loading" || state.status === "ready" ? (
        <HashOutputGrid
          messages={messages}
          digest={state.status === "ready" ? state.digest : null}
          loading={state.status === "loading"}
        />
      ) : null}
    </section>
  )
}

export { DigestSection }
export type { MurmurHash3DigestState }
