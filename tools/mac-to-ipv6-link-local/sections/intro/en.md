## What is IPv6 Link-Local Address?

IPv6 Link-Local addresses are special IPv6 addresses that are automatically configured on every IPv6-enabled interface. They always start with the prefix fe80::/10 and are used for communication between devices on the same network segment. These addresses are not routable beyond the local link and are commonly used for neighbor discovery, router discovery, and other local network protocols. Link-local addresses can be generated from a device's MAC address using the EUI-64 format.

### Input Formats

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64 Output

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Interface Suffix

- `%eth0`
- `%en0`
- `%wlan0`
