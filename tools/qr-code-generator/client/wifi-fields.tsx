import { SelectField, SwitchField, TextInputField } from "./form-controls"

import type {
  MissingContentReason,
  QrCodeGeneratorMessages,
  QrContentHandlers,
  QrContentState,
  SelectChoice,
  WifiSecurity,
} from "./types"

function WifiFields({
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
  const securityOptions: readonly SelectChoice<WifiSecurity>[] = [
    { label: messages.securityWpa, value: "WPA" },
    { label: messages.securityWep, value: "WEP" },
    { label: messages.securityNoPassword, value: "nopass" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInputField
        error={missing === "wifiSsid" ? messages.missingWifiSsid : undefined}
        id="qr-wifi-ssid"
        label={messages.wifiSsidLabel}
        value={content.wifi.ssid}
        onChange={(value) => {
          handlers.onWifiChange("ssid", value)
        }}
      />
      <SelectField
        id="qr-wifi-security"
        label={messages.wifiSecurityLabel}
        options={securityOptions}
        value={content.wifi.security}
        onValueChange={(value) => {
          handlers.onWifiChange("security", value)
        }}
      />
      <TextInputField
        id="qr-wifi-password"
        label={messages.wifiPasswordLabel}
        value={content.wifi.password}
        onChange={(value) => {
          handlers.onWifiChange("password", value)
        }}
      />
      <SwitchField
        checked={content.wifi.hidden}
        id="qr-wifi-hidden"
        label={messages.wifiHiddenLabel}
        onCheckedChange={(checked) => {
          handlers.onWifiChange("hidden", checked)
        }}
      />
    </div>
  )
}

export { WifiFields }
