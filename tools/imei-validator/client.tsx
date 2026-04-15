import { useId, useMemo, useState } from "react"

import { IMEIInputCard } from "./components/imei-input-card"
import { IMEIResultsCard } from "./components/imei-results-card"
import { validateIMEI, type IMEIValidationResult } from "./core/imei"
import type { IMEIValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: IMEIValidationResult,
  messages: IMEIValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (validation.reason === "invalid-length") return messages.invalidLength
  if (validation.reason === "invalid-format") return messages.invalidFormat
  if (validation.reason === "invalid-checksum") return messages.invalidChecksum
  return messages.invalid
}

function ImeiValidatorClient({
  messages,
}: Readonly<{ messages: IMEIValidatorMessages }>) {
  const inputId = useId()
  const [imei, setIMEI] = useState("")

  const analysis = useMemo(() => (imei ? validateIMEI(imei) : null), [imei])
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <IMEIInputCard
        inputId={inputId}
        messages={messages}
        imei={imei}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onIMEIChange={setIMEI}
      />

      <IMEIResultsCard
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default ImeiValidatorClient
