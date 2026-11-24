## Convert JSON to an Excel spreadsheet

Paste a JSON array or open a local `.json` file, check the spreadsheet preview, and choose **Download XLSX**. The converter creates one worksheet with a header row. Each object becomes a row, and fields found anywhere in the array become columns. This works well for API records, product lists, and data exports. If an API response wraps the records inside a field such as `data`, paste the array inside that field.

## Expand nested JSON fields into columns

**Expand nested fields** is on by default. For example, the two records below produce the columns `name`, `contact.city`, and `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

With expansion off, `contact` stays in one column as JSON text such as `{"city":"Oslo"}`. Arrays stay in one cell in either mode, so `tags` does not create extra rows. Fields that are missing or set to `null` appear as blank cells.

## What Excel keeps from the JSON

Numbers and booleans normally become Excel numbers and logical values. Numbers outside Excel’s precision or range are kept as text to preserve their digits. JSON strings stay as text, so IDs such as `"00123"`, dates written as strings, and text starting with `=` keep their original characters.

## Preview and download locally

The preview shows the first part of the sheet. The XLSX download includes all records and columns. The conversion runs in your browser, and your JSON stays on your device. For a plain-text export, use the [JSON to CSV Converter](../json-to-csv-converter/).
