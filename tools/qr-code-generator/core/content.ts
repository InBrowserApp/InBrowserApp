const QR_CONTENT_TYPES = [
  "text",
  "wifi",
  "contact",
  "sms",
  "phone",
  "email",
  "location",
  "calendar",
] as const

type QrContentType = (typeof QR_CONTENT_TYPES)[number]
type WifiSecurity = "WPA" | "WEP" | "nopass"
type MissingContentReason =
  | "text"
  | "wifiSsid"
  | "contact"
  | "smsPhone"
  | "phone"
  | "emailTo"
  | "locationCoordinates"
  | "calendarDetails"

type WifiContent = Readonly<{
  hidden: boolean
  password: string
  security: WifiSecurity
  ssid: string
}>

type ContactContent = Readonly<{
  address: string
  email: string
  firstName: string
  lastName: string
  organization: string
  phone: string
  title: string
  website: string
}>

type SmsContent = Readonly<{
  message: string
  phone: string
}>

type EmailContent = Readonly<{
  body: string
  subject: string
  to: string
}>

type LocationContent = Readonly<{
  altitude: string
  latitude: string
  longitude: string
}>

type CalendarContent = Readonly<{
  description: string
  end: string
  location: string
  start: string
  title: string
}>

type QrContentState = Readonly<{
  calendar: CalendarContent
  contact: ContactContent
  email: EmailContent
  location: LocationContent
  phone: string
  sms: SmsContent
  text: string
  wifi: WifiContent
}>

type QrPayloadResult = Readonly<{
  missing: MissingContentReason | null
  payload: string
}>

const DEFAULT_QR_CONTENT_STATE: QrContentState = {
  calendar: {
    description: "",
    end: "",
    location: "",
    start: "",
    title: "",
  },
  contact: {
    address: "",
    email: "",
    firstName: "",
    lastName: "",
    organization: "",
    phone: "",
    title: "",
    website: "",
  },
  email: {
    body: "",
    subject: "",
    to: "",
  },
  location: {
    altitude: "",
    latitude: "",
    longitude: "",
  },
  phone: "",
  sms: {
    message: "",
    phone: "",
  },
  text: "https://inbrowser.app",
  wifi: {
    hidden: false,
    password: "",
    security: "WPA",
    ssid: "",
  },
}

export { DEFAULT_QR_CONTENT_STATE, QR_CONTENT_TYPES }
export type {
  CalendarContent,
  ContactContent,
  EmailContent,
  LocationContent,
  MissingContentReason,
  QrContentState,
  QrContentType,
  QrPayloadResult,
  SmsContent,
  WifiContent,
  WifiSecurity,
}
