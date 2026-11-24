## How to connect a HID device in your browser

Connect a supported human interface device, such as a game controller, joystick, pedal, or macro pad. Select **Connect device** and choose the device in the WebHID picker. The viewer shows the vendor ID (VID) and product ID (PID), which help identify the hardware. Use a compatible desktop browser over HTTPS.

## How to read HID collections and report IDs

Open a collection to see its usage page, usage, and report IDs. The usage page groups related functions, while the usage identifies a function within that group. Input reports carry data from the device, output reports describe data a host can send, and feature reports describe device-specific settings or state. Report ID 0 means the interface does not use an explicit report ID.

## How to inspect changing input bytes

Move one control at a time while watching the live hex reports. Highlighted bytes differ from the previous payload for the same report ID. The report ID is shown separately from the payload. Pause capture to inspect the latest reports, or clear the list and start again. Look up the device’s report format to interpret buttons, axes, and other fields.

## Why isn't my device or a collection listed?

Check that the operating system recognizes the device, then reopen the picker. Browsers protect common keyboard and mouse collections, and some devices expose only a subset of their reports to the web. This viewer receives input reports from the selected device and keeps the data in this tab. For standard controls, try the [Gamepad Tester](../gamepad-tester/) or [Keyboard Tester](../keyboard-tester/).
