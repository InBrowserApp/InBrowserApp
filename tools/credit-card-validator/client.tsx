import { useId, useMemo, useState } from "react"

import { CreditCardInputCard } from "./components/credit-card-input-card"
import { CreditCardResultsCard } from "./components/credit-card-results-card"
import {
  detectCardBrand,
  formatCardNumber,
  validateCardNumber,
  type CreditCardValidationResult,
} from "./core/credit-card"
import type { CreditCardValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: CreditCardValidationResult,
  messages: CreditCardValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.isLuhnValid) return messages.invalidLuhn
  if (!validation.isLengthValid) return messages.invalidLength
  return messages.invalid
}

function CreditCardValidatorClient({
  messages,
}: Readonly<{ messages: CreditCardValidatorMessages }>) {
  const inputId = useId()
  const [cardNumber, setCardNumber] = useState("")

  const analysis = useMemo(
    () => (cardNumber.length > 0 ? validateCardNumber(cardNumber) : null),
    [cardNumber]
  )
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <CreditCardInputCard
        inputId={inputId}
        messages={messages}
        cardNumber={cardNumber}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onCardNumberChange={(value) => {
          const digits = value.replace(/\D/g, "")
          const brand = detectCardBrand(digits)
          setCardNumber(formatCardNumber(digits, brand))
        }}
      />

      <CreditCardResultsCard
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default CreditCardValidatorClient
