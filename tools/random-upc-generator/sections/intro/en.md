## Generate random UPC-A codes

Set a quantity from `1` to `1000`, then select **Generate**. Each line contains one 12-digit UPC-A code. Choose **Copy all** to paste the batch into a test form or spreadsheet, or choose **Download TXT** to save the codes as text.

## Read the check digit and leading zeros

A UPC-A barcode represents a 12-digit product identifier called a `GTIN-12`. The last digit is the check digit calculated from the first 11. In `084044127435`, the leading `0` is part of the code and the final `5` is its check digit. The check digit brings the weighted sum of all 12 digits to a multiple of ten.

## Use the codes for retail testing

Use these sample codes to test product forms, inventory imports, or UPC validation. Store them as text so any leading zero stays in place. To print a test barcode image, paste a generated code into the [Barcode Generator](/tools/barcode-generator/) and choose `UPC`. For a live product listing or packaging, use the GTIN assigned to the product.
