## What is Credit Card Validation?

Credit card validation is a process to check if a card number is potentially valid before processing a transaction. It uses the Luhn algorithm and card brand identification to verify the format.

### Luhn Algorithm

The Luhn algorithm (also known as Mod 10) is a checksum formula used to validate identification numbers. Here's how it works:

1. Starting from the rightmost digit, double every second digit
2. If doubling results in a number greater than 9, subtract 9 from the result
3. Sum all digits. If the total is divisible by 10, the number is valid

### Supported Card Brands

Card brands are identified by their BIN (Bank Identification Number) or IIN (Issuer Identification Number), which are the first few digits of the card number.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
