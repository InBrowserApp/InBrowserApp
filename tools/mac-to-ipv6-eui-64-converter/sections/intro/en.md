## How to convert a MAC address to IPv6

Enter a 48-bit MAC address with colons, hyphens, dots, or no separators. Add the IPv6 `/64` network prefix you want to use. The calculator accepts compressed and expanded notation and requires the host bits of the prefix to be zero. The IPv6 address updates as you type, ready to copy. **Try example** fills both fields with sample values.

## How Modified EUI-64 builds the address

In a `/64` subnet, the network prefix supplies the first 64 bits and the interface ID supplies the last 64. Modified EUI-64 inserts `ff:fe` between the two halves of the MAC address and flips the universal/local bit in the first byte. For example, `00:11:22:33:44:55` becomes the interface ID `211:22ff:fe33:4455`. With `2001:db8:1:2::/64`, the result is `2001:db8:1:2:211:22ff:fe33:4455`.

## Common IPv6 prefixes

- **Link-local.** Use `fe80::/64` for communication on the same link. The link-local button fills this prefix and keeps your MAC address. To add an interface name such as `%eth0`, use the [IPv6 link-local converter](/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Unique local (ULA).** The ULA button fills `fd12:3456:789a:1::/64`, an example from `fd00::/8` for internal networks. To create a unique prefix for your own network, use the [IPv6 ULA generator](/tools/ipv6-ula-generator/).
- **Global unicast.** Enter a `/64` subnet from the allocation your ISP, cloud provider, or network administrator gave you.
- **Documentation.** `2001:db8:1:2::/64` comes from the `2001:db8::/32` range reserved for documentation and examples.

## Will this match my device's IPv6 address?

The result is the address for your prefix under Modified EUI-64. A device may use another interface ID, such as a stable or temporary ID generated for privacy. If you already have an IPv6 address with a MAC-derived interface ID, you can recover the MAC with the [IPv6 to MAC converter](/tools/ipv6-address-to-mac-address-converter/).
