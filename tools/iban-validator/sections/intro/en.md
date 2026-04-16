## What is IBAN?

IBAN (International Bank Account Number) is a standardized identifier for bank accounts used in international payments.

### IBAN Structure

An IBAN starts with a two-letter country code, two check digits, and a country-specific BBAN.

### Checksum Validation

IBAN validity is checked with the ISO 13616 mod-97 algorithm.

1. Remove spaces and move the first four characters to the end
2. Convert letters to numbers (A=10, B=11, ..., Z=35)
3. Compute mod 97; a valid IBAN leaves a remainder of 1

Each country defines a fixed length and structure for the BBAN portion.
