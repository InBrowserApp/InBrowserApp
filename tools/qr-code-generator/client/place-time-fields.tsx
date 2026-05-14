import { TextInputField, TextareaField } from "./form-controls"

import type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
} from "./types"

function LocationFields({
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
  const error =
    missing === "locationCoordinates"
      ? messages.missingLocationCoordinates
      : undefined

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TextInputField
        error={error}
        id="qr-location-latitude"
        inputMode="decimal"
        label={messages.locationLatitudeLabel}
        type="number"
        value={content.location.latitude}
        onChange={(value) => handlers.onLocationChange("latitude", value)}
      />
      <TextInputField
        id="qr-location-longitude"
        inputMode="decimal"
        label={messages.locationLongitudeLabel}
        type="number"
        value={content.location.longitude}
        onChange={(value) => handlers.onLocationChange("longitude", value)}
      />
      <TextInputField
        id="qr-location-altitude"
        inputMode="decimal"
        label={messages.locationAltitudeLabel}
        type="number"
        value={content.location.altitude}
        onChange={(value) => handlers.onLocationChange("altitude", value)}
      />
    </div>
  )
}

function CalendarFields({
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
  const error =
    missing === "calendarDetails" ? messages.missingCalendar : undefined

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInputField
        error={error}
        id="qr-calendar-title"
        label={messages.calendarTitleLabel}
        value={content.calendar.title}
        onChange={(value) => handlers.onCalendarChange("title", value)}
      />
      <TextInputField
        id="qr-calendar-location"
        label={messages.calendarLocationLabel}
        value={content.calendar.location}
        onChange={(value) => handlers.onCalendarChange("location", value)}
      />
      <TextInputField
        id="qr-calendar-start"
        label={messages.calendarStartLabel}
        type="datetime-local"
        value={content.calendar.start}
        onChange={(value) => handlers.onCalendarChange("start", value)}
      />
      <TextInputField
        id="qr-calendar-end"
        label={messages.calendarEndLabel}
        type="datetime-local"
        value={content.calendar.end}
        onChange={(value) => handlers.onCalendarChange("end", value)}
      />
      <div className="sm:col-span-2">
        <TextareaField
          id="qr-calendar-description"
          label={messages.calendarDescriptionLabel}
          value={content.calendar.description}
          onChange={(value) => handlers.onCalendarChange("description", value)}
        />
      </div>
    </div>
  )
}

export { CalendarFields, LocationFields }
