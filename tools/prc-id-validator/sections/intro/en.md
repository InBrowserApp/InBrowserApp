## What is a PRC Resident ID?

The 18-digit PRC Resident ID number includes an address code, birthdate, sequence code, and checksum. This validator checks those parts offline and helps you inspect how the number is structured.

### How validation works

- Remove spaces and hyphens and normalize the last character to uppercase `X`
- Require exactly 18 characters with 17 digits plus a final digit or `X`
- Match the first 6 digits against the 2023 administrative region dataset and parse the 8-digit birthdate
- Recompute the checksum digit from the first 17 digits and compare it with the final character

### What the result shows

- Region breakdown: province, city, district/county, and the raw region code
- Birthdate, current age, sequence code, and the gender value derived from the sequence code
- The normalized ID together with the expected and actual check digit for debugging

### Example

`110101199001010015` can be read as:

- `110101` -> Dongcheng District, Beijing
- `19900101` -> birthdate `1990-01-01`
- `001` -> sequence code
- `5` -> check digit

### Important note

This tool only performs structural and checksum validation offline. A number that passes these checks is not proof of a real or currently active identity document.

Region names are based on the 2023 administrative division dataset.
