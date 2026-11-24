## How to plan IPv4 subnets with VLSM

Enter a parent block in CIDR notation, such as 192.168.10.0/24. Add a row for each network and enter how many usable host addresses it needs, including any gateway or growth capacity you want to reserve. Calculate the plan to see each assigned network, mask, usable range, broadcast address, and any CIDR blocks left for future use.

Variable-length subnet masking (VLSM) divides a network into subnets of different sizes. The calculator chooses the smallest block that fits each requirement and places the largest blocks first at valid CIDR boundaries. A standard subnet reserves its network and broadcast addresses. For example, 50 hosts fit in a /26 with 62 usable addresses.

Choose a /31 only for an IPv4 point-to-point link that supports two usable addresses. Choose a /32 for a single address, such as a router loopback. Both options omit a broadcast address. The calculation and the subnet names stay in your browser.
