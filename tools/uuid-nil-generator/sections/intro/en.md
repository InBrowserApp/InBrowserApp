## What Is a Nil UUID?

A nil UUID is the standardized UUID whose 128 bits are all zero. Its canonical text form is `00000000-0000-0000-0000-000000000000`, and it is often used to mean "no UUID has been assigned yet."

## When to Use It

Use a nil UUID when an API, database column, fixture, or configuration file requires a UUID-shaped value but the real identifier is intentionally absent. It is useful as a placeholder in tests, import templates, migration scripts, and protocols that define an explicit empty UUID value.

## What to Watch For

Do not treat the nil UUID as a generated unique identifier. It is the same value every time, so storing it where a real object ID is expected can hide missing data, break uniqueness assumptions, or make records look connected when they are not.
