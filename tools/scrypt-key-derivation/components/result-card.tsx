import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LoaderCircle } from "@workspace/ui/icons"

import type { ScryptKeyDerivationPageMessages } from "../client/types"
import { DerivedKeySection, type DerivedKeyState } from "./derived-key-section"
import { formatFileSize } from "./input-card"

type ResultCardProps = Readonly<{
  state: DerivedKeyState
  selectedFile: File | null
  messages: ScryptKeyDerivationPageMessages
}>

function ResultCard({ state, selectedFile, messages }: ResultCardProps) {
  return (
    <Card>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.derivedKeyLabel}</CardTitle>
          <CardDescription className={selectedFile ? "break-all" : undefined}>
            {selectedFile
              ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
              : messages.derivedKeyDescription}
          </CardDescription>
        </div>
        {state.status === "loading" ? (
          <CardAction>
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col" aria-live="polite">
        <DerivedKeySection state={state} messages={messages} />
      </CardContent>
    </Card>
  )
}

export { ResultCard }
