## Inspect Parquet files in your browser

Open or drop a `.parquet` file to browse its data and inspect every field’s physical type, logical annotation, and repetition. Nested groups remain visible in the schema. The summary shows row count, columns, row groups, compression, and the file’s creator when available. You can try the included sample without choosing a file.

## Browse data and export CSV or JSON

Data loads one page at a time. Use the page controls to move through the file, and select a cell to read its full value. Switch to **Schema** to inspect fields. Use **Export data** to download the current page or all rows as UTF-8 CSV or a JSON array. Whole-file exports are prepared in batches and can be cancelled.

CSV includes column names and quotes commas, quotes, and line breaks. Nulls become empty CSV fields and remain `null` in JSON. Nested values use JSON; binary values use hexadecimal text. To preserve 64-bit integers, JSON writes them as strings. Dates and timestamps use ISO text, with millisecond precision. Decimals follow the reader’s numeric precision, so this viewer is not a lossless conversion tool for high-precision decimal or timestamp data.

## Local processing

Your file is read locally in a background worker and is never uploaded. The viewer reads the footer first, then only the row ranges needed for browsing. Parquet row groups may still require substantial memory to decode; export size is limited by your browser’s available memory. Uncompressed, Snappy, Gzip, Brotli, Zstandard, and LZ4 codecs are supported by hyparquet and its compressor package. Encrypted Parquet files are not supported.
