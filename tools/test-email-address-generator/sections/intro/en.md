## Generate a batch of test email addresses

Choose a domain, enter the quantity, and select **Generate**. Choose **Any example domain** to mix domains in one batch. Each address appears once per batch. Copy the results into a form or spreadsheet, or download a UTF-8 text file with one address per line for your fixtures.

## Which email domains can I use?

Faker.js generates addresses on `example.com`, `example.net`, and `example.org`. These [reserved example domains](https://www.iana.org/help/example-domains) are used in documentation and sample data. In `alex.morgan42@example.com`, the part before `@` is the local part and `example.com` is the domain. Use one domain when your test expects a fixed value, or mix domains to exercise filtering and imports.

## What can I test with these addresses?

Use these samples to test registration form inputs, email formatting, account lists, or deduplication in a database. The generator produces address text without creating inboxes. For a delivery or verification-link test, use an inbox you control or your development mail sandbox.
