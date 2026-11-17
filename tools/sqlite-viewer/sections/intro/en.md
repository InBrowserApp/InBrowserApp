## Inspect SQLite files locally

Open a SQLite 3 database to browse its tables and views, inspect column definitions, indexes, foreign keys, and CREATE statements, or run a read-only SQL query. Try the sample database to explore the workspace without choosing a file. Files and queries stay in your browser and are not saved automatically.

## Query and export results

Select a table to preview its rows. Edit the SQL and use **Run query** or **Ctrl/⌘ + Enter** to execute one SELECT, WITH, or EXPLAIN statement. The result limit bounds the number of loaded rows; pagination displays 50 rows at a time. A query can also stop at the 5 MiB result budget or after 10 seconds. Cancellation keeps the interface responsive and reloads the database snapshot on the next query.

CSV and JSON exports contain the loaded result, including rows on other pages. JSON stores separate column names and row arrays, preserving duplicate names and NULL values. SQLite integers become exact decimal strings and BLOBs become objects with a `$blob` hexadecimal value. CSV uses empty fields for NULL, quotes special characters, and prefixes formula-like text with an apostrophe for safer spreadsheet use.

## Supported databases and limits

Open an unencrypted `.db`, `.sqlite`, or `.sqlite3` file up to 50 MiB. The original file is never modified. This tool loads an in-memory snapshot, so memory use can exceed the file size. WAL and journal sidecar files are not imported; create a clean, checkpointed copy with your database application before opening it here. Encrypted databases, custom SQLite extensions, and database editing are not supported.
