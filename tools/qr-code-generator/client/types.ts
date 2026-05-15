import type {
  MissingContentReason,
  QrContentState,
  QrContentType,
  WifiSecurity,
} from "../core/content"
import type {
  QrErrorCorrectionLevel,
  QrGeneratorOptions,
} from "../core/options"

type QrCodeGeneratorMessages = Readonly<{
  meta: {
    description: string
    name: string
  }
  calendarDescriptionLabel: string
  calendarEndLabel: string
  calendarLocationLabel: string
  calendarStartLabel: string
  calendarTitleLabel: string
  contactAddressLabel: string
  contactEmailLabel: string
  contactFirstNameLabel: string
  contactLastNameLabel: string
  contactOrganizationLabel: string
  contactPhoneLabel: string
  contactTitleLabel: string
  contactWebsiteLabel: string
  contentDescription: string
  contentTitle: string
  contentTypeLabel: string
  copyPayloadLabel: string
  copiedPayloadLabel: string
  darkColorLabel: string
  emailBodyLabel: string
  emailSubjectLabel: string
  emailToLabel: string
  emptyDescription: string
  emptyTitle: string
  errorCorrectionLabel: string
  errorCorrectionHigh: string
  errorCorrectionLow: string
  errorCorrectionMedium: string
  errorCorrectionQuartile: string
  lightColorLabel: string
  locationAltitudeLabel: string
  locationLatitudeLabel: string
  locationLongitudeLabel: string
  marginLabel: string
  missingCalendar: string
  missingContact: string
  missingEmailTo: string
  missingLocationCoordinates: string
  missingPhone: string
  missingSmsPhone: string
  missingText: string
  missingWifiSsid: string
  optionsDescription: string
  optionsTitle: string
  payloadEmpty: string
  payloadPreviewLabel: string
  phoneLabel: string
  jpgDownloadLabel: string
  pngDownloadLabel: string
  previewDescription: string
  previewTitle: string
  qrAlt: string
  renderErrorTitle: string
  securityNoPassword: string
  securityWep: string
  securityWpa: string
  sizeLabel: string
  smsMessageLabel: string
  smsPhoneLabel: string
  svgDownloadLabel: string
  textLabel: string
  textPlaceholder: string
  typeCalendar: string
  typeContact: string
  typeEmail: string
  typeLocation: string
  typePhone: string
  typeSms: string
  typeText: string
  typeWifi: string
  webpDownloadLabel: string
  wifiHiddenLabel: string
  wifiPasswordLabel: string
  wifiSecurityLabel: string
  wifiSsidLabel: string
}>

type SelectChoice<TValue extends string> = Readonly<{
  label: string
  value: TValue
}>

type QrOptionHandlers = Readonly<{
  onColorChange: (key: "darkColor" | "lightColor", value: string) => void
  onErrorCorrectionChange: (value: QrErrorCorrectionLevel) => void
  onNumberChange: (key: "margin" | "size", value: number) => void
}>

type QrContentHandlers = Readonly<{
  onCalendarChange: <TKey extends keyof QrContentState["calendar"]>(
    key: TKey,
    value: QrContentState["calendar"][TKey]
  ) => void
  onContactChange: <TKey extends keyof QrContentState["contact"]>(
    key: TKey,
    value: QrContentState["contact"][TKey]
  ) => void
  onEmailChange: <TKey extends keyof QrContentState["email"]>(
    key: TKey,
    value: QrContentState["email"][TKey]
  ) => void
  onLocationChange: <TKey extends keyof QrContentState["location"]>(
    key: TKey,
    value: QrContentState["location"][TKey]
  ) => void
  onPhoneChange: (value: string) => void
  onSmsChange: <TKey extends keyof QrContentState["sms"]>(
    key: TKey,
    value: QrContentState["sms"][TKey]
  ) => void
  onTextChange: (value: string) => void
  onTypeChange: (value: QrContentType) => void
  onWifiChange: <TKey extends keyof QrContentState["wifi"]>(
    key: TKey,
    value: QrContentState["wifi"][TKey]
  ) => void
}>

export type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
  QrContentType,
  QrErrorCorrectionLevel,
  QrGeneratorOptions,
  QrOptionHandlers,
  SelectChoice,
  WifiSecurity,
}
