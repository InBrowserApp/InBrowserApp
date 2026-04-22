## What is email validation?

Email validation checks whether an address follows common syntax rules for the local part, `@` sign, domain labels, and top-level domain. It is useful for quick form QA, sample-data cleanup, and catching obvious typos before submission.

### What this validator checks

- One `@` separating the local part and domain
- Total length, local-part length, and domain length limits
- Allowed characters, dot placement, hyphen rules, and TLD structure
- A normalized result with the domain lowercased for comparison

### Examples

- Valid: `name@example.com`
- Valid: `first.last+news@example.co.uk`
- Invalid: `name..dots@example.com`
- Invalid: `user@-example.com`

Internationalized domains should be entered in Punycode ASCII form, such as `user@xn--bcher-kva.example`.

### What this tool does not check

- Whether the mailbox exists or can receive mail
- DNS, MX, SMTP, or disposable-provider checks
- Whether a website will accept the address under its own business rules
