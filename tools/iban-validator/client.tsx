import { useId, useMemo, useState } from "react"

import { IbanInputCard } from "./components/iban-input-card"
import { IbanResultsCard } from "./components/iban-results-card"
import {
  formatIBAN,
  validateIBAN,
  type IBANValidationResult,
} from "./core/iban"
import type { IBANValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: IBANValidationResult,
  messages: IBANValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.isCountryValid) return messages.invalidCountry
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isFormatValid || !validation.isStructureValid) {
    return messages.invalidFormat
  }
  if (!validation.isChecksumValid) return messages.invalidChecksum
  return messages.invalid
}

function IbanValidatorClient({
  lang,
  messages,
}: Readonly<{ lang: string; messages: IBANValidatorMessages }>) {
  const inputId = useId()
  const [iban, setIban] = useState("")

  const analysis = useMemo(
    () => (iban.length > 0 ? validateIBAN(iban) : null),
    [iban]
  )
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <IbanInputCard
        inputId={inputId}
        messages={messages}
        iban={iban}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onIBANChange={(value) => {
          setIban(formatIBAN(value))
        }}
      />

      <IbanResultsCard
        lang={lang}
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default IbanValidatorClient
