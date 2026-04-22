## What is BIC/SWIFT?

BIC (Bank Identifier Code), also called a SWIFT code, identifies financial institutions in international payments.

### BIC Structure

A BIC is 8 or 11 characters: bank code (4 letters), country code (2 letters), location code (2 alphanumerics), and optional branch code (3 alphanumerics).

### Validation Rules

Validation checks length, character set, and ISO 3166 country codes.

1. Strip spaces and hyphens
2. Ensure the format matches 8 or 11 characters
3. Parse bank, country, location, and branch codes

Branch code "XXX" or an 8-character BIC indicates the primary office.

Location code second character 0 indicates a test BIC; 1 indicates a passive participant.
