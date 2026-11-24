## How to use the browser serial terminal

Connect your Arduino, ESP32, Raspberry Pi Pico, or USB serial adapter with a data cable. Set the baud rate used by the device, such as 9600 or 115200, then select **Connect** and choose its port in the browser. This serial monitor uses 8 data bits, no parity, one stop bit, and no flow control (8N1).

## Sending text and hex bytes

Text is sent in UTF-8. Choose LF, CR, or CR + LF if your device uses a line ending to submit commands. For binary commands, select **Hex** and enter complete bytes such as `41 54 0D 0A`. Hex sends the bytes as entered, with no automatic line ending.

## Reading and saving serial logs

The log shows incoming (RX) and outgoing (TX) data with timestamps. Switch to Hex to inspect individual bytes when text looks garbled. Pause scrolling to inspect an earlier entry while data keeps arriving, or download the retained log as a text file. Serial data stays in this tab until you choose to save it.

## Why can't I connect to my device?

Use an up-to-date browser with Web Serial support and make sure the operating system recognizes the serial port. Try another cable and close any other serial monitor already using the port. If the device connects but produces unreadable text, check the baud rate and try viewing the bytes in Hex.
