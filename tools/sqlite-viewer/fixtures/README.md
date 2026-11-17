# SQLite sample

`sample.sqlite` is a small, original SQLite 3 database for the sample button
and real-engine tests. It contains projects, tasks, a summary view, an index,
a foreign key, NULL, a BLOB, Unicode text, and an integer above JavaScript's
safe integer range. It contains no third-party or personal data.

To reproduce a fresh copy, run `sqlite3 new-sample.sqlite < sample.sql` in this
directory. The database is intentionally checkpointed and has no sidecar files.
