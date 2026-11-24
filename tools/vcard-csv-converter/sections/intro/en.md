## Convert VCF contacts to a CSV spreadsheet

Choose **vCard to CSV**, open a `.vcf` file or paste its contents, and select **Convert**. The CSV contains one row per contact. Download it to sort or edit the address book in Excel, Google Sheets, or another spreadsheet application. Use **Try an example** to see the expected format in either direction.

## Turn a CSV contact list into vCards

Choose **CSV to vCard** and add a UTF-8 CSV with column names in the first row. The tool recognizes `Full Name`, `First Name`, `Last Name`, `Email`, `Phone`, `Company`, `Job Title`, `Website`, `Address`, and `Notes`, along with common address-book variants. For example, a row under `First Name,Last Name,Email` can become a contact with both a display name and a structured name.

Download the resulting VCF to import the contacts into your address book. The file contains vCard 3.0 entries, one for each contact row.

## Understand what fits in CSV

CSV is a flat table. This tool keeps the first email, phone number, website, and address from each card. Photos, field labels, and custom vCard properties stay in the original VCF. Keep that original if you need a complete backup. Your contacts are converted locally in your browser.
