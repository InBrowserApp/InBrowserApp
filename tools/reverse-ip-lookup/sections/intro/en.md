Reverse IP Lookup converts an IPv4 or IPv6 address into its reverse DNS name and queries the corresponding `PTR` record. It helps you check which hostname an address owner publishes for mail servers, network appliances, cloud instances, and troubleshooting notes.

## What It Checks

For IPv4, the tool reverses the octets and queries an `in-addr.arpa` name. For IPv6, it expands the address to 32 hexadecimal nibbles, reverses them, and queries the matching `ip6.arpa` name. The result shows the exact reverse DNS domain, DNS status code, resolver, address family, and any returned hostnames with their TTL values.

## How the Query Runs

The lookup runs from your browser using DNS-over-HTTPS. You can choose Cloudflare, Google, or AliDNS as the resolver, and the browser sends a standard `PTR` query to that endpoint. No server-side InBrowser.App lookup service is involved.

## How to Read Missing Results

A missing PTR answer is common. Many residential, cloud, private, or newly assigned addresses do not publish reverse DNS records. A successful DNS response with no hostnames does not prove the address is unused; it only means the reverse zone did not return a usable `PTR` record through the selected resolver.

## Practical Notes

- Reverse DNS maps an IP address to a hostname; it is different from finding every domain hosted on the same address.
- PTR records are controlled by the IP address owner or upstream provider, not by the domain owner alone.
- Mail and security systems often compare forward and reverse DNS, so a PTR record should usually point to a hostname that resolves back to the same address.
