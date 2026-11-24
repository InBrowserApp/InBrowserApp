## How to read a DNS zone file

Open a BIND-format DNS export or paste the text. Load the example to see an SOA record, IPv4 and IPv6 address records, mail records, and a TXT string. For each row, the parser shows the record name, class, type, time to live in seconds, and record data. Filter by a name, type such as MX, or part of a value, then copy the visible records as JSON for an inventory or migration.

## How origin, TTL, and record data are handled

An `$ORIGIN` of `example.com.` makes the relative owner `www` resolve to `www.example.com.` The `@` owner refers to the current origin, and an indented record inherits the previous owner. If a file has no `$ORIGIN`, supply its domain in Initial origin. A default `$TTL` of `1h` becomes 3,600 seconds, and a record with its own TTL uses that value. Record data retains its quotes and escapes and keeps relative targets as written, so `"hello; world"` stays a single TXT string and `mail` in MX data stays `mail`.

## What to expect from the results

The parser reads comments, quoted text, and multiline records. Parsing notes give the line number of each problem while showing the records the parser could read. If the zone uses `$INCLUDE` or `$GENERATE`, expand those directives before pasting the full records. The tool reads the input locally. To confirm that a provider can load the zone, use its import or validation workflow.
