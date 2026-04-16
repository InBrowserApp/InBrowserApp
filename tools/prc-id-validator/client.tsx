import { useId, useMemo, useState } from "react"

import { PRCIdInputCard } from "./components/prc-id-input-card"
import { PRCIdResultsCard } from "./components/prc-id-results-card"
import { analyzeResidentId, normalizeResidentId } from "./core/resident-id"
import type { PRCIdValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: ReturnType<typeof analyzeResidentId>,
  messages: PRCIdValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (validation.isPartial) return null
  if (validation.length > 18) return messages.invalidLength
  if (validation.hasFormatIssue) return messages.invalidFormat
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isFormatValid) return messages.invalidFormat
  if (!validation.isRegionValid) return messages.invalidRegion
  if (!validation.isBirthdateValid) return messages.invalidBirthdate
  if (!validation.isChecksumValid) return messages.invalidChecksum
  return messages.invalid
}

function PrcIdValidatorClient({
  messages,
}: Readonly<{ messages: PRCIdValidatorMessages }>) {
  const inputId = useId()
  const [residentId, setResidentId] = useState("")

  const analysis = useMemo(
    () => (residentId.length > 0 ? analyzeResidentId(residentId) : null),
    [residentId]
  )
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <PRCIdInputCard
        inputId={inputId}
        messages={messages}
        residentId={residentId}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onResidentIdChange={(value) => {
          setResidentId(normalizeResidentId(value))
        }}
      />

      <PRCIdResultsCard
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default PrcIdValidatorClient
