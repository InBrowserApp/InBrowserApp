DNS Lookup checks the public DNS records returned for a domain name. It is useful when you are verifying a new site launch, debugging email delivery, checking CDN or load balancer changes, or confirming whether DNSSEC-related responses look different across resolvers.

## When to Use

Use this tool when you need a quick browser-side answer for common DNS record types. A and AAAA records show IPv4 and IPv6 destinations, CNAME records show aliases, MX records identify mail exchangers, TXT records often contain SPF or verification tokens, and NS/SOA/CAA/SRV/HTTPS/SVCB records expose delegation, authority, certificate, service, and modern endpoint hints.

## How It Works

The lookup runs in your browser with DNS over HTTPS. Choose a resolver, select one or more record types, and submit a domain or URL. URLs are normalized to their hostname before the query is sent, so pasting `https://www.example.com/path` queries `www.example.com`.

## Reading Results

Each record type is shown separately with the DNS response code, resolver flags, answer rows, and raw JSON. `NoError` means the DNS server answered successfully, but it can still return no answer rows for a specific type. `NXDomain`, `ServFail`, or `Refused` usually means the name does not exist, the resolver could not complete the lookup, or the resolver policy blocked the request.

## Privacy and Limitations

Queries are sent to the selected DNS over HTTPS resolver, not to an InBrowser.App server. Resolver behavior, cache state, DNSSEC validation, and local network filtering can all affect results. This tool does not replace authoritative `dig` checks from multiple networks, but it is a fast way to inspect what public DoH resolvers return from your current browser.
