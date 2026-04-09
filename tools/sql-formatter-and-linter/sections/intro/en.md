## What Is SQL Formatter & Linter?

SQL Formatter & Linter reformats SQL queries in your browser and checks them for a small set of high-signal issues at the same time. It is useful when you want cleaner query layout, consistent keyword casing, and quick feedback on risky patterns like `SELECT *` or `UPDATE` statements without a `WHERE` clause.

## When To Use It

Use this tool when you are reviewing hand-written SQL, cleaning up pasted queries before sharing them, or comparing formatting across different SQL dialects. It works well for ad hoc query review, pull request cleanup, and browser-only formatting without sending your SQL to a server.

## What It Checks

This rewrite keeps the formatter and linter separate but coordinated. Formatting uses `sql-formatter` with dialect-aware layout options, while linting surfaces parse errors, missing semicolons, broad `SELECT *` usage, unsafe mutations, long lines, and keyword case drift.
