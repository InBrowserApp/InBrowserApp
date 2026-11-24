## How to export SQLite to a SQL file

Open or drop a SQLite 3 database file such as `.db`, `.sqlite`, or `.sqlite3`. The tool generates a SQL dump automatically. Turn on **Schema only** to export the structure without table rows, then choose **Download .sql** to save the complete script. Try the sample database to see what the output looks like.

## What a SQLite SQL dump contains

A SQL dump is a text script for recreating a database. It includes `CREATE` statements for tables, indexes, views, and triggers, plus `INSERT` statements for table rows in the full export. Use it to review schema changes in Git, keep a readable backup, or move a database to another SQLite environment.

The source file stays on your device. Export a standalone database copy if the source uses a write-ahead log (WAL). Use the application that created it or SQLite’s backup command so the copy includes committed changes from the log.

## How to restore the SQL dump

Run this command to import the script into a new SQLite database:

```sh
sqlite3 restored.sqlite < database.sql
```

Replace `database.sql` with the name of your download. The script uses SQLite syntax. Restore databases that use virtual tables or extensions in a SQLite installation with the required modules.

To browse tables or export query results as CSV or JSON, open the [SQLite Viewer](../sqlite-viewer/). To build a database from spreadsheets, use [CSV & Excel to SQLite](../csv-excel-to-sqlite/).
