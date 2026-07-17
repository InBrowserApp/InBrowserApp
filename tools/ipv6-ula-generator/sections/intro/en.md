## What is an IPv6 Unique Local Address?

An IPv6 Unique Local Address (ULA) is intended for communication inside sites, private networks, and connected organizations. The complete ULA space is `fc00::/7`. Its eighth bit is the **L bit**: the value `1` selects the locally assigned `fd00::/8` range used by this generator, while the `fc00::/8` half remains reserved for a different assignment method.

ULAs are not globally reachable by default, but “local” does not mean secret or automatically secure. They can cross routed site boundaries, VPNs, and private interconnects when operators configure those paths.

## How this RFC 4193 generator builds a /48

This RFC 4193 generator asks the Web Crypto API for exactly 40 random bits and combines them with `fd`. The result is a statistically unique 48-bit site prefix such as `fd12:3456:789a::/48`. Generation stays in the browser: it does not collect a MAC address, timestamp, device identifier, or server response.

There are `2^40` possible Global IDs—about 1.1 trillion. Secure randomness makes accidental reuse unlikely, but it cannot guarantee that two independently generated prefixes will never collide. Record the chosen `/48` in your network documentation and reuse it consistently.

## Planning the 65,536 available /64 subnets

After the `/48` site prefix comes a 16-bit Subnet ID. Values from `0000` through `ffff` provide 65,536 possible `/64` networks. For example, Subnet ID `00a0` turns `fd12:3456:789a::/48` into the canonical network `fd12:3456:789a:a0::/64`.

The remaining 64 bits are the Interface ID. This tool plans network prefixes only; it does not generate host `/128` addresses or derive interface identifiers from MAC addresses.

## Where ULAs belong—and where they do not

ULAs work well for stable internal addressing, VPN-connected sites, lab networks, and services that should keep an internal prefix while also using global unicast IPv6. They are not a firewall or an inherent security boundary. Apply normal access controls, filter inappropriate ULA traffic at site boundaries, and keep internal ULA records out of public DNS.

A host can use a ULA and a global unicast address at the same time. Use the global address for Internet reachability and the durable ULA prefix for the private paths that need it.
