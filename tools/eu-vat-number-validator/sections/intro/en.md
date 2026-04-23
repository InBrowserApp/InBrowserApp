## What is an EU VAT number?

A VAT identification number is issued by an EU member state to businesses that are registered for Value Added Tax. It starts with a two-letter country code (for example, `BE` for Belgium or `EL` for Greece), followed by a country-specific sequence of digits and sometimes letters. Tax authorities use it to track cross-border trade and refund claims, so mistakes on invoices, contracts, or procurement records can easily block a payment or trigger an audit.

## What this tool actually checks

This checker runs three independent validations, all in your browser:

1. **Country code** — the leading two letters must match an EU member state that takes part in the VAT scheme (including the special `EL` code used for Greece).
2. **Format** — the remaining characters must match the country's documented VAT format. For example, Belgian VAT is exactly ten digits, Austrian VAT starts with `U` followed by eight digits, and Dutch VAT has the shape `<nine digits>B<two digits>`.
3. **Checksum** — where a deterministic checksum exists in the country's VAT rules (Austria, Belgium, Denmark, Finland, France, Germany, Italy, Netherlands, Poland, Portugal, Spain, Sweden), the final digit or letter is recomputed and compared.

A number that passes all three is syntactically well-formed. That is not the same as confirming the business is currently registered — for that you still need the European Commission's VIES service or the local tax authority. This tool is best used before that final check, to catch the typos, transposed digits, and copy-paste errors that make a VIES query fail for the wrong reason.

## Common things it catches

- Numbers that look right at a glance but are a country short (for example, starting with `US` or `UK`).
- Leading zeros trimmed by a spreadsheet, producing a number that is one digit too short.
- Spaces, dots, or dashes that an invoicing system pasted in — the tool normalizes them away and checks the result.
- The classic Greek `GR` versus VAT `EL` mix-up, which the format check rejects immediately.

## What the result card shows

Beyond a simple valid/invalid badge, the result breaks out the country, the normalized number, the format the country expects, and whether the checksum passed, failed, or was skipped because the country does not publish one. That detail is useful when you need to explain a rejection — "format is fine, checksum disagrees" is much more actionable than "invalid."

## Privacy

Every check runs locally in your browser. Nothing is sent to a server, logged, or stored anywhere but your own browser's localStorage (for the last input you typed, so it survives a page reload). You can paste a customer's VAT number without worrying about where it ends up.
