## Explore SQLite databases in your browser

Open a SQLite 3 database to browse tables and views, inspect columns, indexes, foreign keys, and CREATE statements, or run a read-only SQL query. Try the sample database to explore the workspace. Your file is processed locally and is never modified.

## Query and export results

Select a table or view to load its rows, then edit the SQL to filter, sort, or join data. Run one SELECT, WITH, or EXPLAIN statement with **Run query** or **Ctrl/⌘ + Enter**. Click a cell to inspect and copy its full value.

Choose a result limit of 100, 1,000, or 10,000 rows and browse the result 50 rows at a time. Queries have a 10-second limit and a 5 MiB result-size limit. CSV and JSON exports include all loaded rows across pages.

JSON uses separate column names and row arrays to preserve duplicate names and NULL values. Integers are exact decimal strings, and BLOBs contain a `$blob` hex value. CSV includes a header row, uses blank fields for NULL, and prefixes formula-like text with an apostrophe.

## Supported SQLite files

Open an unencrypted `.db`, `.sqlite`, or `.sqlite3` file up to 50 MiB. For a database using WAL, create a checkpointed copy before opening it; WAL and journal sidecar files are not loaded. Custom SQLite extensions are not supported. Files and queries are not saved automatically.
