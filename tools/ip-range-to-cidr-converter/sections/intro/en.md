## What This Tool Does

This tool converts a start IP address and end IP address into the smallest set of CIDR blocks that exactly covers the full range. Everything runs locally in your browser, so the addresses never leave your device.

## How CIDR Covering Works

A CIDR block represents a power-of-two sized network aligned on a matching boundary. When a range starts or ends in the middle of those boundaries, one block is not enough. The converter keeps taking the largest aligned block that fits, then repeats until the entire range is covered.

## Why Multiple Blocks Can Appear

Ranges such as 192.168.1.10 to 192.168.1.25 do not start on a clean network boundary and do not end on one either. The exact result is therefore a short list of blocks, each covering one aligned portion without including extra addresses outside the requested range.

## When This Is Useful

Use it when preparing firewall rules, route summaries, ACL entries, cloud security groups, or migration checklists where a raw start and end range needs to become standard CIDR notation.
