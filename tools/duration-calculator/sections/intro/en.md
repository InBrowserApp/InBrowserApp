## What is a duration?

A duration is an amount of time you add to or subtract from a
base time. This calculator starts from a local date and time in
a chosen time zone, then applies the same duration in both
directions.

## ISO 8601 examples

- `PT45M` means 45 minutes.
- `P2DT6H` means 2 days and 6 hours.
- `P1DT2H3M4.005S` means 1 day, 2 hours, 3 minutes, and
  4.005 seconds.

## How this calculator works

- Enter a base time in `YYYY-MM-DD HH:mm:ss.SSS` and choose the
  time zone you want to evaluate.
- Enter the duration either as ISO 8601 text or with the day,
  hour, minute, second, and millisecond fields. The tool keeps
  both inputs in sync and normalizes overflow.
- Enter positive durations only. Use the built-in add and
  subtract result cards to compare both directions.
- The result cards show the adjusted local time, the UTC ISO
  8601 timestamp, and Unix timestamps in seconds and
  milliseconds. Offsets can change around daylight saving time
  transitions.
