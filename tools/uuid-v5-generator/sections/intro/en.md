Generate UUID v5 identifiers from a namespace UUID and a name without sending either value to a server. UUID v5 is useful when you need a stable identifier that can be recreated later from the same input, such as an ID for a domain name, URL, object path, account handle, or fixture record.

## How UUID v5 Works

UUID v5 combines a namespace UUID with a name string, hashes those bytes with SHA-1, and then applies the RFC 4122 version and variant bits. Because the input is deterministic, `example.com` inside the DNS namespace always produces the same UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Choosing A Namespace

Use `ns:DNS` for domain names, `ns:URL` for URLs, `ns:OID` for object identifiers, and `ns:X.500 DN` for X.500 distinguished names. You can also paste your own UUID namespace when your application needs identifiers scoped to a product, tenant, dataset, or migration.

## When To Use It

Choose UUID v5 when reproducibility matters more than randomness. It is a good fit for deterministic imports, test fixtures, namespaced records, and systems that need the same logical item to receive the same ID across runs. For secret tokens or unpredictable public IDs, use a random generator instead.
