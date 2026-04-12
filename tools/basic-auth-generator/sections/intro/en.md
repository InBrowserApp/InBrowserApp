## What is Basic Auth?

Basic Auth puts `username:password` into the `Authorization` header after Base64 encoding it. It is simple and widely supported, but Base64 is only an encoding step, not encryption.

## What this tool generates

- An `Authorization: Basic ...` header you can paste into API clients.
- A ready-to-run `curl` example for quick testing.
- Everything runs locally in the browser.

## What to keep in mind

- Use HTTPS whenever you send Basic Auth credentials.
- Anyone who sees the header can decode the original username and password.
- Basic Auth is convenient for internal tools, staging environments, and quick API checks.
