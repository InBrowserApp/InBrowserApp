import { TextInputField, TextareaField } from "./form-controls"

import type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
  QrContentType,
} from "./types"

function MessageFields({
  content,
  handlers,
  messages,
  missing,
  type,
}: Readonly<{
  content: QrContentState
  handlers: QrContentHandlers
  messages: QrCodeGeneratorMessages
  missing: MissingContentReason | null
  type: QrContentType
}>) {
  if (type === "text") {
    return (
      <TextareaField
        error={missing === "text" ? messages.missingText : undefined}
        id="qr-text"
        label={messages.textLabel}
        placeholder={messages.textPlaceholder}
        value={content.text}
        onChange={handlers.onTextChange}
      />
    )
  }

  if (type === "sms") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInputField
          error={missing === "smsPhone" ? messages.missingSmsPhone : undefined}
          id="qr-sms-phone"
          inputMode="tel"
          label={messages.smsPhoneLabel}
          type="tel"
          value={content.sms.phone}
          onChange={(value) => handlers.onSmsChange("phone", value)}
        />
        <TextareaField
          id="qr-sms-message"
          label={messages.smsMessageLabel}
          value={content.sms.message}
          onChange={(value) => handlers.onSmsChange("message", value)}
        />
      </div>
    )
  }

  if (type === "phone") {
    return (
      <TextInputField
        error={missing === "phone" ? messages.missingPhone : undefined}
        id="qr-phone"
        inputMode="tel"
        label={messages.phoneLabel}
        type="tel"
        value={content.phone}
        onChange={handlers.onPhoneChange}
      />
    )
  }

  if (type !== "email") {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInputField
        error={missing === "emailTo" ? messages.missingEmailTo : undefined}
        id="qr-email-to"
        inputMode="email"
        label={messages.emailToLabel}
        type="email"
        value={content.email.to}
        onChange={(value) => handlers.onEmailChange("to", value)}
      />
      <TextInputField
        id="qr-email-subject"
        label={messages.emailSubjectLabel}
        value={content.email.subject}
        onChange={(value) => handlers.onEmailChange("subject", value)}
      />
      <div className="sm:col-span-2">
        <TextareaField
          id="qr-email-body"
          label={messages.emailBodyLabel}
          value={content.email.body}
          onChange={(value) => handlers.onEmailChange("body", value)}
        />
      </div>
    </div>
  )
}

export { MessageFields }
