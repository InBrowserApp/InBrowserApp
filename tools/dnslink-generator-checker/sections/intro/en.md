## Generate a DNSLink TXT record for IPFS

DNSLink points a domain or subdomain at a content path. Enter your domain and paste an IPFS CID or an IPFS or IPNS path. Copy the generated **Name** and **TXT value** into a new TXT record at your DNS provider. For example, a domain of `www.example.com` uses the record name `_dnslink.www.example.com`. If the DNS editor appends `example.com` automatically, enter `_dnslink.www` in its name field.

## Check what your DNSLink points to

Select **Check published record** to see the TXT answers from Cloudflare and Google. Leave the target blank to look up an existing setup, or enter your intended target to compare it with the published value. After a change, resolvers can return an older value until their caches expire. The displayed TTL is the time a returned DNS answer can stay cached.

## Update an IPFS website behind a custom domain

Use an IPFS CID to point directly to a fixed version of your files, or use an IPNS path to follow a name that can be updated. DNSLink tells compatible clients and gateways which content to resolve. To serve that content at your own HTTPS domain, configure a gateway that supports DNSLink and point your domain to it. [IPFS custom domains and DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
