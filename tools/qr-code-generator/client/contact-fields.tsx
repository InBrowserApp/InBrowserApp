import { TextInputField } from "./form-controls"

import type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
} from "./types"

function ContactFields({
  content,
  handlers,
  messages,
  missing,
}: Readonly<{
  content: QrContentState
  handlers: QrContentHandlers
  messages: QrCodeGeneratorMessages
  missing: MissingContentReason | null
}>) {
  const error = missing === "contact" ? messages.missingContact : undefined

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInputField
        error={error}
        id="qr-contact-first-name"
        label={messages.contactFirstNameLabel}
        value={content.contact.firstName}
        onChange={(value) => handlers.onContactChange("firstName", value)}
      />
      <TextInputField
        id="qr-contact-last-name"
        label={messages.contactLastNameLabel}
        value={content.contact.lastName}
        onChange={(value) => handlers.onContactChange("lastName", value)}
      />
      <TextInputField
        id="qr-contact-organization"
        label={messages.contactOrganizationLabel}
        value={content.contact.organization}
        onChange={(value) => handlers.onContactChange("organization", value)}
      />
      <TextInputField
        id="qr-contact-title"
        label={messages.contactTitleLabel}
        value={content.contact.title}
        onChange={(value) => handlers.onContactChange("title", value)}
      />
      <TextInputField
        autoComplete="tel"
        id="qr-contact-phone"
        inputMode="tel"
        label={messages.contactPhoneLabel}
        type="tel"
        value={content.contact.phone}
        onChange={(value) => handlers.onContactChange("phone", value)}
      />
      <TextInputField
        autoComplete="email"
        id="qr-contact-email"
        inputMode="email"
        label={messages.contactEmailLabel}
        type="email"
        value={content.contact.email}
        onChange={(value) => handlers.onContactChange("email", value)}
      />
      <TextInputField
        id="qr-contact-website"
        inputMode="url"
        label={messages.contactWebsiteLabel}
        type="url"
        value={content.contact.website}
        onChange={(value) => handlers.onContactChange("website", value)}
      />
      <TextInputField
        id="qr-contact-address"
        label={messages.contactAddressLabel}
        value={content.contact.address}
        onChange={(value) => handlers.onContactChange("address", value)}
      />
    </div>
  )
}

export { ContactFields }
