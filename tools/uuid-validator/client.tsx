import { useId, useMemo, useState } from "react"

import { UuidInputCard } from "./components/uuid-input-card"
import { UuidResultsCard } from "./components/uuid-results-card"
import { validateUuid } from "./core/uuid"

import type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
} from "./client/types"

function getFeedbackMessage(
  analysis: UuidValidationAnalysis,
  messages: UuidValidatorMessages
) {
  if (analysis.reason === "empty") return messages.invalidEmpty
  if (analysis.reason === "format") return messages.invalidFormat
  if (analysis.reason === "version") return messages.invalidVersion
  if (analysis.reason === "variant") return messages.invalidVariant
  if (analysis.kind === "nil" || analysis.kind === "max") {
    return messages.variantSpecial
  }
  return messages.validDescription
}

function UuidValidatorClient({
  messages,
}: Readonly<{ messages: UuidValidatorMessages }>) {
  const inputId = useId()
  const [uuid, setUuid] = useState("")

  const analysis = useMemo(
    () => (uuid.length > 0 ? validateUuid(uuid) : null),
    [uuid]
  )
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
        <UuidInputCard
          inputId={inputId}
          messages={messages}
          uuid={uuid}
          analysis={analysis}
          feedbackMessage={feedbackMessage}
          onUuidChange={setUuid}
        />
      </div>

      <UuidResultsCard analysis={analysis} messages={messages} />
    </div>
  )
}

export default UuidValidatorClient
