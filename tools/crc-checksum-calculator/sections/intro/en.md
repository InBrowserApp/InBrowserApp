# CRC Checksum Calculator

CRC (Cyclic Redundancy Check) checksums are compact values used to detect
accidental data changes. They are common in network frames, archive formats,
embedded protocols, firmware updates, and file integrity workflows where a fast
error-detection value is more useful than a cryptographic signature.

## When to use it

Use this calculator when you need to compare CRC values from documentation,
hardware protocols, file formats, or another system. Paste text for quick
checks, or import a file when the checksum needs to be calculated from the exact
byte stream.

## Supported variants

The tool calculates the common variants from the legacy InBrowser.App CRC tool:
CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM, and several CRC-64 models including ECMA-182, GO-ISO, MS, NVME, REDIS,
WE, and XZ.

## Things to watch for

CRC variant names matter. The same input can produce different values depending
on polynomial, initial value, reflection settings, and final XOR. If you are
matching a protocol or vendor spec, choose the result whose variant name matches
that spec rather than treating every CRC width as interchangeable.

CRC is designed for accidental error detection, not for password storage,
signatures, or tamper-proof security. For security-sensitive verification, use a
cryptographic hash or signature workflow instead.
