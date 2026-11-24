import { usbHex, usbVersion } from "./core/format"

import type english from "./messages/en.json"
import type { Device } from "./usb"

export function DeviceDetails({
  device,
  messages,
}: {
  device: Device
  messages: typeof english
}) {
  const fields = [
    { label: messages.vendorId, value: usbHex(device.vendorId, 4), code: true },
    {
      label: messages.productId,
      value: usbHex(device.productId, 4),
      code: true,
    },
    { label: messages.manufacturer, value: device.manufacturerName },
    { label: messages.serialNumber, value: device.serialNumber, code: true },
    {
      label: messages.usbVersion,
      value: usbVersion(
        device.usbVersionMajor,
        device.usbVersionMinor,
        device.usbVersionSubminor
      ),
      code: true,
    },
    {
      label: messages.deviceVersion,
      value: usbVersion(
        device.deviceVersionMajor,
        device.deviceVersionMinor,
        device.deviceVersionSubminor
      ),
      code: true,
    },
    { label: messages.class, value: usbHex(device.deviceClass), code: true },
    {
      label: messages.subclass,
      value: usbHex(device.deviceSubclass),
      code: true,
    },
    {
      label: messages.protocol,
      value: usbHex(device.deviceProtocol),
      code: true,
    },
  ]
  return (
    <div className="space-y-3 border-t pt-3">
      <h2 className="font-semibold wrap-anywhere">
        {device.productName || messages.unnamed}
      </h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 min-[380px]:grid-cols-3">
        {fields
          .filter((field) => field.value)
          .map(({ label, value, code }) => (
            <div key={label} className="min-w-0 text-sm">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="wrap-anywhere">
                {code ? <code dir="ltr">{value}</code> : value}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  )
}
