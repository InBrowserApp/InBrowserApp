## What It Does

פענוח כותרת HTTP Basic Authorization כדי לחלץ שם משתמש וסיסמה מ-Base64. שימושי לניפוי שגיאות ובדיקות API.

## Accepted Input

הדבק משהו כמו: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
