import { QR_CONTENT_TYPES } from "../core/content"
import { SelectField } from "./form-controls"

import type {
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentType,
  SelectChoice,
} from "./types"

function getContentTypeLabel(
  value: QrContentType,
  messages: QrCodeGeneratorMessages
) {
  return {
    calendar: messages.typeCalendar,
    contact: messages.typeContact,
    email: messages.typeEmail,
    location: messages.typeLocation,
    phone: messages.typePhone,
    sms: messages.typeSms,
    text: messages.typeText,
    wifi: messages.typeWifi,
  }[value]
}

function ContentTypeSelect({
  handlers,
  messages,
  type,
}: Readonly<{
  handlers: QrContentHandlers
  messages: QrCodeGeneratorMessages
  type: QrContentType
}>) {
  const choices: readonly SelectChoice<QrContentType>[] = QR_CONTENT_TYPES.map(
    (value) => ({
      label: getContentTypeLabel(value, messages),
      value,
    })
  )

  return (
    <SelectField
      id="qr-content-type"
      label={messages.contentTypeLabel}
      options={choices}
      value={type}
      onValueChange={handlers.onTypeChange}
    />
  )
}

export { ContentTypeSelect }
