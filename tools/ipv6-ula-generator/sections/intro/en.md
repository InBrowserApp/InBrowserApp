## Generate an IPv6 ULA /48 prefix

Copy the generated `fd` prefix for your home network, lab, or VPN. Save the chosen `/48` with your network configuration so you can reuse it when adding subnets. Select **Generate new prefix** when you want a fresh allocation.

## Calculate a /64 subnet

Enter a hexadecimal **Subnet ID** from `0000` to `ffff`. For example, ID `00a0` within `fd12:3456:789a::/48` gives `fd12:3456:789a:a0::/64`. A `/48` gives you 65,536 possible `/64` subnets, so you can assign separate prefixes to networks such as LAN, guest Wi-Fi, or a VPN.

## Where the fd prefix comes from

RFC 4193 defines Unique Local Addresses in `fc00::/7`. The locally assigned half, `fd00::/8`, starts with `fd`. The generator adds a random 40-bit Global ID from the browser’s Web Crypto API to make the `/48`.

## When to use a Unique Local Address

Use a ULA for stable IPv6 addressing within a network or across sites connected by VPN. A device can also use a global IPv6 address for public Internet traffic while keeping its ULA for internal services.
