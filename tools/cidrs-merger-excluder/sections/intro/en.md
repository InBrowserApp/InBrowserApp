## What This Tool Does

This tool combines CIDR blocks into the smallest equivalent set, then subtracts any CIDR blocks you put in the exclusion list. It supports IPv4 and IPv6 in the same run, and all processing happens locally in your browser.

## How Merge and Exclude Works

The merge list is normalized first: host bits are cleared, overlapping networks are folded together, and adjacent networks are collapsed when they can be represented by a shorter CIDR block. After that, the exclusion list is subtracted from the merged ranges. The final output is expanded back into the minimal CIDR list that exactly covers what remains.

## When This Is Useful

Use it when cleaning firewall rules, preparing cloud security group entries, reviewing VPN allowlists, summarizing route tables, or removing reserved ranges from a larger allocation. It is especially helpful when copied configuration contains overlapping blocks or when a broad network needs a few smaller ranges removed.

## Input Notes

Enter one CIDR per line, or separate multiple CIDRs with commas. IPv4 and IPv6 blocks can be pasted together, but exclusions only apply to blocks from the same address family. Invalid entries are reported with their list and line number so you can fix large pasted inputs without guessing.
