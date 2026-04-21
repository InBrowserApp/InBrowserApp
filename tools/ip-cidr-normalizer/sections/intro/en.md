## What This Tool Normalizes

This tool converts IPv4 addresses, IPv6 addresses, and CIDR ranges into canonical notation directly in the browser. It removes unnecessary IPv4 padding, compresses IPv6 to the standard shortened form, and preserves the original address family.

## How CIDR Normalization Works

When you enter a CIDR block, the tool rewrites the address to the actual network address for that prefix. Host bits are cleared, so `192.168.0.15/24` becomes `192.168.0.0/24`, and `2001:db8::1234/64` becomes `2001:db8::/64`.

## When This Is Useful

Use it before comparing firewall rules, ACLs, route tables, VPN allowlists, or imported configuration files. Normalized input makes duplicate detection, reviews, and copy-paste into network tooling more reliable.

## Why Input May Be Rejected

The tool rejects malformed IPv4 or IPv6 addresses, invalid CIDR prefixes, and address or prefix combinations that do not match the protocol family. If the value cannot be parsed unambiguously, it is safer to reject it than normalize the wrong network.
