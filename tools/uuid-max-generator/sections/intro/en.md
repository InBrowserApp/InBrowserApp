## What Is a Max UUID?

A max UUID is the standardized UUID whose 128 bits are all set to one. Its canonical text form is `ffffffff-ffff-ffff-ffff-ffffffffffff`, and it is often used to mean the highest possible UUID value.

## When to Use It

Use a max UUID when an API, database query, fixture, or range check needs a UUID-shaped upper bound or sentinel value. It is useful in tests, migration scripts, pagination cursors, and protocols that define an explicit maximum UUID value.

## What to Watch For

Do not treat the max UUID as a generated unique identifier. It is the same value every time, so storing it where a real object ID is expected can hide sentinel logic, break uniqueness assumptions, or make records sort to the end unexpectedly.
