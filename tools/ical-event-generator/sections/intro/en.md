## Create Calendar Files Without Leaving the Browser

This tool generates standard `.ics` event files directly in your browser. You can define timed or all-day events, choose a time zone strategy, add reminders, and export the final calendar entry without syncing any data to a server.

### Why Use It

- Build a clean calendar invite when you only need a file, not a full calendar account workflow.
- Keep sensitive schedules local while still generating a standards-based event attachment.
- Tune recurrence rules and reminder offsets before downloading the final `.ics` file.

### Suggested Workflow

1. Fill in the event summary, location, notes, and optional reference URL.
2. Pick the event range, then decide whether to export UTC timestamps or preserve the original time zone with `TZID`.
3. Add recurrence and reminder rules only if the event needs them, then download the file and attach it wherever you share the event.

### Notes

- `UTC` output is usually the safest choice when you want broad calendar compatibility.
- `TZID` output keeps the original scheduling context for clients that understand named time zones.
- For all-day events, the form keeps the end date inclusive even though the ICS file stores it as an exclusive end date.
