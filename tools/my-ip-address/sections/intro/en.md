## What This Tool Shows

This tool looks up the public IPv4 and IPv6 addresses that external services can see from your current browser session. If the browser can also expose local interface candidates through WebRTC, the tool lists those separately.

## Why IPv4, IPv6, and WebRTC Results Can Be Different

Your IPv4 address and IPv6 address can come from different network paths, ISPs, or tunneling setups. WebRTC candidates may include private LAN addresses, temporary IPv6 interface addresses, or VPN-related routes that normal websites do not always display directly.

## How the Lookup Works

The tool queries public IP providers such as Cloudflare, geojs.io, ip.sb, and ipify.org, then enriches the detected address with hostname, ASN, organization, country, timezone, and coordinate metadata when available. This means the tool needs an active internet connection and depends on the response quality of those third-party services.

## Why an Address Might Be Missing

An address can fail to appear if your network blocks one protocol family, your VPN or proxy filters the request, your browser disables WebRTC exposure, or the upstream lookup service is temporarily unavailable. If IPv6 is unavailable on your network, seeing only IPv4 is normal.
