import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { ContactFields } from "./contact-fields"
import { ContentTypeSelect } from "./content-type-select"
import { MessageFields } from "./message-fields"
import { CalendarFields, LocationFields } from "./place-time-fields"
import { WifiFields } from "./wifi-fields"

import type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
  QrContentType,
} from "./types"

type ContentCardProps = Readonly<{
  content: QrContentState
  handlers: QrContentHandlers
  messages: QrCodeGeneratorMessages
  missing: MissingContentReason | null
  payload: string
  type: QrContentType
}>

function getMissingMessage(
  missing: MissingContentReason | null,
  messages: QrCodeGeneratorMessages
) {
  switch (missing) {
    case "text":
      return messages.missingText
    case "wifiSsid":
      return messages.missingWifiSsid
    case "contact":
      return messages.missingContact
    case "smsPhone":
      return messages.missingSmsPhone
    case "phone":
      return messages.missingPhone
    case "emailTo":
      return messages.missingEmailTo
    case "locationCoordinates":
      return messages.missingLocationCoordinates
    case "calendarDetails":
      return messages.missingCalendar
    case null:
      return ""
  }
}

function ActiveFields(props: Omit<ContentCardProps, "payload">) {
  if (props.type === "wifi") return <WifiFields {...props} />
  if (props.type === "contact") return <ContactFields {...props} />
  if (props.type === "location") return <LocationFields {...props} />
  if (props.type === "calendar") return <CalendarFields {...props} />

  return <MessageFields {...props} />
}

function ContentCard({
  content,
  handlers,
  messages,
  missing,
  payload,
  type,
}: ContentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.contentTitle}</CardTitle>
        <CardDescription>{messages.contentDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ContentTypeSelect
          handlers={handlers}
          messages={messages}
          type={type}
        />
        <ActiveFields
          content={content}
          handlers={handlers}
          messages={messages}
          missing={missing}
          type={type}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t">
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-sm font-medium">
            {messages.payloadPreviewLabel}
          </span>
          <ToolCopyButton
            copiedLabel={messages.copiedPayloadLabel}
            copyLabel={messages.copyPayloadLabel}
            value={payload}
          />
        </div>
        <Textarea
          aria-label={messages.payloadPreviewLabel}
          className="min-h-28 resize-y font-mono text-xs"
          dir="auto"
          placeholder={
            getMissingMessage(missing, messages) || messages.payloadEmpty
          }
          readOnly
          value={payload}
        />
      </CardFooter>
    </Card>
  )
}

export { ContentCard }
