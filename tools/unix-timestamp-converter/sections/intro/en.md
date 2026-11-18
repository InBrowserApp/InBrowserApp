## Convert a Unix timestamp to a date

Paste a timestamp to see the date and time in your device’s time zone, plus UTC, ISO 8601, and how long ago or how far ahead it is. For example, `1704067200` seconds and `1704067200000` milliseconds both show `2024-01-01T00:00:00.000Z` in ISO 8601.

## Convert a date to a Unix timestamp

Edit **Date & Time** to convert a local date and time back to an epoch timestamp in the selected unit. Click **Now** to get the current timestamp. For logs and APIs, use the ISO 8601 value ending in `Z` when you need an unambiguous UTC time.

## Choose seconds, milliseconds, or nanoseconds

Unix timestamps measure time from January 1, 1970 at 00:00:00 UTC. **Auto** reads up to 10 digits as seconds, 11 to 13 as milliseconds, and longer values as nanoseconds. Choose the unit manually if you know the source format, especially for older millisecond values or when the displayed date looks off. The date display has millisecond precision.
