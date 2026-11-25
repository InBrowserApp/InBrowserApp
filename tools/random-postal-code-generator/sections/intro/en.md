## Generate postal codes for testing

Choose a country or region, enter the quantity, and select **Generate**. You can copy the batch or download a UTF-8 text file with one postal code per line. Use the results to fill test forms, seed sample data, or check how checkout and sign-up forms display local postal codes.

## Compare postal code formats

Postal codes can include letters, spaces, hyphens, or leading zeros. A US ZIP code can look like `02108`, and ZIP+4 adds a hyphen and four digits, as in `02108-1234`. A UK postcode can look like `SW1 2AB`, a Canadian postal code like `K1A 0B1`, a Japanese postal code like `100-0001`, and a Brazilian CEP like `01001-000`. The country or region you choose controls the generated format independently of the page language.

When importing the results into a spreadsheet or database, store postal codes as text. Importing `02108` as a number strips the leading zero and changes the value.

## Can I use the results for mailing?

Faker.js creates sample codes in the selected format. A code may or may not be assigned to a real delivery area. For mailing, look up the code for the actual address with the relevant postal service.
