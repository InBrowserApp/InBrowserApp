import { useId, useMemo, useState } from "react"

import { PRCIdInputCard } from "./components/prc-id-input-card"
import { PRCIdResultsCard } from "./components/prc-id-results-card"
import {
  normalizeResidentId,
  validateResidentId,
  type ResidentIdValidationResult,
} from "./core/resident-id"
import type { PRCIdValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: ResidentIdValidationResult,
  messages: PRCIdValidatorMessages
) {
  if (validation.isValid) return messages.valid
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
    () => (residentId.length > 0 ? validateResidentId(residentId) : null),
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
