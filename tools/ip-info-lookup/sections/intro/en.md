## What This Tool Looks Up

IP Info Lookup resolves an IPv4 address, IPv6 address, domain, or URL and shows the public metadata that internet services can report for each address. It is useful when you need to inspect where a domain points, which network owns an address, what reverse DNS hostname exists, or whether IPv4 and IPv6 records lead to different providers.

## How Domain and URL Lookups Work

When you enter a domain or URL, the tool extracts the hostname and queries the selected DNS-over-HTTPS resolver for both A and AAAA records. Each returned address is then enriched separately, so dual-stack domains can show different countries, ASNs, ISPs, hostnames, or time zones for IPv4 and IPv6.

## What the Results Mean

Location and ISP fields come from public IP metadata providers such as geojs.io and ip.sb, while hostnames come from reverse DNS PTR lookups when available. These records describe how public databases see the address, not the exact physical location of a person or device.

## Privacy and Accuracy Notes

The lookup runs in your browser and sends DNS and IP metadata requests to third-party services. VPNs, proxies, CDNs, mobile networks, and cloud platforms can make the reported location or organization differ from the end user or server you expected. Empty fields are normal for private, reserved, newly allocated, or lightly documented addresses.
