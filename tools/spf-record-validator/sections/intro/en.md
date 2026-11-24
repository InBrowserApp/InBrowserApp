## How to check an SPF record

Paste the value of one DNS TXT record, starting with `v=spf1`, then select Check syntax. If DNS displays the TXT value as several quoted strings, join the strings in order and keep any spaces they contain. The checker shows each mechanism or modifier and flags syntax errors next to the text that needs attention. The input stays in your browser.

## How SPF mechanisms and qualifiers work

SPF (Sender Policy Framework) lets a domain describe which servers can send email on its behalf. The receiver checks each mechanism in order. For example, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` checks an IPv4 block and a provider’s SPF policy before the final `-all`. Qualifiers on mechanisms indicate pass (`+`), fail (`-`), softfail (`~`), or neutral (`?`). The default qualifier is `+`. Modifiers such as `redirect=` use an equals sign and have no qualifier.

## What the DNS lookup count means

RFC 7208 allows up to 10 lookup-causing terms during SPF evaluation. The number here counts the possible terms in the pasted record, including `a`, `mx`, `include`, `exists`, `ptr`, and an active `redirect`. An `include` or `redirect` can lead to more terms, and a matching mechanism can end evaluation early. To confirm a live SPF policy and its full lookup count, inspect the published TXT record and its referenced domains.
