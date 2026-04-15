# What does this validator check?

This tool validates email address syntax. It does not verify mailbox deliverability.

## Checks performed

- Single @ with local and domain parts
- Local part characters, dot placement, and length
- Domain labels, hyphen rules, and top-level domain

Internationalized domains must be in Punycode (ASCII).
