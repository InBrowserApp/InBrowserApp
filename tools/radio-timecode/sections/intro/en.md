## What Radio Timecode Sync Does

Radio Timecode Sync generates browser audio that follows common long-wave radio time signal formats: JJY, BPC, DCF77, MSF, and WWVB. It is useful when a compatible radio-controlled clock cannot receive the real transmitter indoors, or when you want to test how a clock reacts to a known station format.

## How to Use It

Select the station that matches the clock, place the device speaker near the clock's antenna area, start the signal, and give the clock enough time to listen through at least one full minute frame. Keep the volume low at first, then raise it only if the clock does not detect the signal.

## Accuracy and Limitations

The generated time comes from this device's system clock plus the optional offset, so synchronize the device clock before using the tool. Browsers cannot emit the real long-wave carrier directly; this tool uses a lower-frequency square-wave approximation that may work through harmonics on some devices. Hardware, speaker placement, and clock firmware all affect results, and JJY call sign audio is intentionally omitted.
