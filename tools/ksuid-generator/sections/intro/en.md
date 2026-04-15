## What is KSUID?

KSUID (K-Sortable Unique IDentifier) is a 27-character base62 identifier that embeds a 32-bit timestamp (seconds since 2014-05-13) and 128 bits of random data.

**Key points:**

- **Time-sortable**: lexicographic order follows creation time.
- **High uniqueness**: 128 bits of randomness per ID.
- **Second precision**: KSUID stores seconds, so millisecond inputs are rounded down.
