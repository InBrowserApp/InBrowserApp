## Generate random VINs for testing

Set the quantity from `1` to `1000`, then select **Generate**. Each line contains one 17-character vehicle identification number (VIN). Choose **Copy all** to paste the batch into a test form or spreadsheet, or **Download TXT** to save a text file with one VIN per line.

## Read the VIN and its check digit

The first three characters form the manufacturer identifier. Characters four through eight describe the vehicle, and the ninth character is the check digit. The final eight characters form the vehicle identifier section. The letters `I`, `O`, and `Q` are omitted to avoid confusion with digits. The check digit is calculated from the other 16 characters and can be a digit from `0` through `9` or `X`. In `1M8GDM9AXKP042788`, for example, the ninth character is `X`.

## Use a sample VIN in a test fixture

Use the generated VINs to exercise required fields, bulk imports, or format and check-digit validation. To test rejection, change only the ninth character to a different digit and submit the value again. The generator produces synthetic VINs, so fields that look like a manufacturer, model year, or serial number should be treated as sample data. For registration, parts lookup, or vehicle history, use the VIN recorded on the vehicle or its documents.
