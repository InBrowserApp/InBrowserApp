## How to connect to a Bluetooth Low Energy device

Turn on Bluetooth and put the device into a connectable mode. Select **Connect device** and choose your peripheral in the browser. This explorer requests access to common GATT services such as Battery Service, Device Information, Heart Rate, and Environmental Sensing. For a custom GATT service, enter its UUID before opening the picker. Use a 16-bit UUID such as `180F` or a full 128-bit UUID from the device documentation.

## How to read GATT characteristics

Expand a service to see its characteristics and their supported operations. Select **Read** to request the current value. Hex shows the bytes exactly as received, while UTF-8 is useful for characteristics that carry text. A battery level, measurement, or other binary value may need to be interpreted using the specification for that characteristic.

## How to capture Bluetooth notifications

Select **Subscribe** on a characteristic with Notify or Indicate support. Updates appear with their time and characteristic UUID. Download the latest 100 notifications as a JSON file for later inspection, or select **Unsubscribe** to stop that stream. The page keeps the log locally.

## Why can't I see my device or its services?

Web Bluetooth support depends on the browser and operating system. Use a supported browser over HTTPS, keep the device nearby, and disconnect it from other apps if it only allows one connection. The browser exposes authorized GATT services on Bluetooth LE peripherals. Bluetooth Classic devices, such as headphones that only expose audio profiles, require a different interface.
