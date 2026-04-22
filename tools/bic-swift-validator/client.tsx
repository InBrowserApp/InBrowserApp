import { useId, useMemo, useState } from "react"

import { BicSwiftInputCard } from "./components/bic-swift-input-card"
import { BicSwiftResultsCard } from "./components/bic-swift-results-card"
import { normalizeBIC, validateBIC, type BICValidationResult } from "./core/bic"
import type { BICSwiftValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: BICValidationResult,
  messages: BICSwiftValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isCountryValid) return messages.invalidCountry
  if (!validation.isBankCodeValid) return messages.invalidBank
  if (!validation.isLocationCodeValid) return messages.invalidLocation
  if (!validation.isBranchCodeValid) return messages.invalidBranch
  if (!validation.isFormatValid) return messages.invalidFormat
  return messages.invalid
}

function BicSwiftValidatorClient({
  lang,
  messages,
}: Readonly<{ lang: string; messages: BICSwiftValidatorMessages }>) {
  const inputId = useId()
  const [bic, setBIC] = useState("")

  const analysis = useMemo(() => (bic ? validateBIC(bic) : null), [bic])
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <BicSwiftInputCard
        inputId={inputId}
        messages={messages}
        bic={bic}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onBICChange={(value) => {
          setBIC(normalizeBIC(value))
        }}
      />

      <BicSwiftResultsCard
        lang={lang}
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default BicSwiftValidatorClient
