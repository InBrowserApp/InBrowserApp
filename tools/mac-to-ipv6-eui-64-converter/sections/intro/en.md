## How the address is formed

Modified EUI-64 inserts `ff:fe` between the two halves of the MAC address and flips the universal/local bit in the first byte. For example, `00:11:22:33:44:55` becomes the interface ID `211:22ff:fe33:4455`. With `2001:db8:1:2::/64`, the resulting address is `2001:db8:1:2:211:22ff:fe33:4455`.

Enter `fe80::/64` for a link-local address. To append an interface name, use the [link-local converter](/tools/mac-address-to-ipv6-link-local-address-converter/). For a deployable unicast address, use a /64 assigned to your network. The example uses a documentation prefix.
