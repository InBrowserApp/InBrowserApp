import { useId, useMemo, useState } from "react"

import { EmailInputCard } from "./components/email-input-card"
import { EmailResultsCard } from "./components/email-results-card"
import { validateEmail, type EmailValidationResult } from "./core/email"
import type { EmailValidatorMessages } from "./client/types"

function getFeedbackMessage(
  validation: EmailValidationResult,
  messages: EmailValidatorMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.hasSingleAt) return messages.invalidAt
  if (!validation.isLocalLengthValid) return messages.invalidLocalLength
  if (!validation.isDomainLengthValid) return messages.invalidDomainLength
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isLocalCharsValid || !validation.isLocalDotsValid) {
    return messages.invalidLocal
  }
  if (
    !validation.isDomainCharsValid ||
    !validation.isDomainDotsValid ||
    !validation.isDomainLabelCharsValid ||
    !validation.isDomainLabelLengthValid
  ) {
    return messages.invalidDomain
  }
  if (!validation.isTldValid) return messages.invalidTld
  return messages.invalid
}

function EmailValidatorClient({
  messages,
}: Readonly<{ messages: EmailValidatorMessages }>) {
  const inputId = useId()
  const [email, setEmail] = useState("")

  const analysis = useMemo(
    () => (email.length > 0 ? validateEmail(email) : null),
    [email]
  )
  const feedbackMessage = analysis
    ? getFeedbackMessage(analysis, messages)
    : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <EmailInputCard
        inputId={inputId}
        messages={messages}
        email={email}
        validation={analysis}
        feedbackMessage={feedbackMessage}
        onEmailChange={setEmail}
      />

      <EmailResultsCard
        analysis={analysis}
        feedbackMessage={feedbackMessage}
        messages={messages}
      />
    </div>
  )
}

export default EmailValidatorClient
