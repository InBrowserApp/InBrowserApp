## What is IPv6 Link-Local Address?

IPv6 Link-Local addresses are special IPv6 addresses that are automatically configured on every IPv6-enabled interface. They always start with the prefix fe80::/10 and are used for communication between devices on the same network segment. These addresses are not routable beyond the local link and are commonly used for neighbor discovery, router discovery, and other local network protocols. Link-local addresses can be generated from a device's MAC address using the EUI-64 format.

### When to Use It

Use this converter when you want the deterministic link-local address that EUI-64 derives from a device MAC address.

### How EUI-64 Mapping Works

1. Normalize the MAC address to 48 bits.
2. Flip the `U/L bit` in the first byte.
3. Insert `ff:fe` in the middle to create a 64-bit interface identifier.
4. Prefix the interface identifier with `fe80::/10`.

### Accepted Input Formats

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Optional Interface Suffix

Add `%eth0`, `%en0`, or another zone index only when a local command needs to know which interface should carry the traffic.
