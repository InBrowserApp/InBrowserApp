import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import type { Pbkdf2KeyDerivationPageMessages } from "../client/types"
import type { DerivedKey } from "../core/pbkdf2"
import { DerivedKeyOutputList } from "./derived-key-output-list"

type DerivedKeyState =
  | { status: "idle" }
  | { status: "loading"; derivedKey: DerivedKey | null }
  | { status: "ready"; derivedKey: DerivedKey }
  | { status: "error"; message: string }

function DerivedKeySection({
  state,
  messages,
}: Readonly<{
  state: DerivedKeyState
  messages: Pbkdf2KeyDerivationPageMessages
}>) {
  if (state.status === "idle") {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {messages.emptyStateDescription}
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
        <DerivedKeyOutputList
          messages={messages}
          derivedKey={state.derivedKey}
          loading={state.status === "loading"}
        />
      ) : null}
    </section>
  )
}

export { DerivedKeySection }
export type { DerivedKeyState }
