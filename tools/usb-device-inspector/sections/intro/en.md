## How to inspect a USB device in your browser

Connect the device with a cable that carries data, then choose **Select device** and pick it in the browser’s WebUSB dialog. The device card shows the vendor ID (VID), product ID (PID), and available identity fields. The USB version comes from the device descriptor. Actual link speed also depends on the cable, port, and operating system.

## How to read configurations, interfaces, and endpoints

Expand a configuration to see the functions its interfaces expose. An interface can have several alternate settings, each with its own class, subclass, protocol, and endpoints. IN endpoints carry data toward the host and OUT endpoints carry data toward the device. The endpoint type and packet size describe how the endpoint transfers data.

## What does the access check tell me?

Select **Check access** to see whether the browser can open the selected device. The check uses the device handle and releases it afterward. Interface access can still depend on the operating system driver or another application. The inspector reads browser-provided descriptors and leaves device settings untouched.

## Why can’t I see or open my USB device?

If your device is missing from the picker, try a data cable and check that the operating system recognizes it. If the browser denies access, check the site’s USB permission or browser policy. If selection succeeds but opening fails, close apps that may be using the device and check the driver requirements for your device and platform. Some USB classes are protected by the browser. See [Device Information](../device-information/) for the capabilities of this browser and system.
