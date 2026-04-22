CIDR Parser turns a block like `10.24.8.19/21` or `2001:db8:abcd::123/64` into the network you actually mean. It normalizes host-address input, shows the canonical subnet, and exposes the boundaries you usually need when writing firewall rules, documenting ranges, or checking whether an allocation is larger than intended.

## What It Shows

The result starts with a quick overview, then breaks the block into practical details: canonical CIDR, total and usable address counts, range start and end, plus the integer values behind the block. For IPv4, you also get the netmask, wildcard mask, and broadcast address. For IPv6, the parser keeps the same workflow but hides fields that do not apply.

## Why Canonicalization Matters

Many pasted CIDR values include host bits. That is fine for humans, but routers, ACLs, and documentation usually need the canonical network address instead. By rewriting the block before you copy anything out, the tool makes it easier to catch off-by-one assumptions before they leak into config.

## Practical Notes

- `/31` and `/32` IPv4 blocks are treated as fully usable, which matches modern point-to-point and host-route usage.
- IPv6 blocks report the full address space and usable range without inventing a broadcast concept.
- Everything runs locally in the browser, so internal subnets do not leave the page while you inspect them.
