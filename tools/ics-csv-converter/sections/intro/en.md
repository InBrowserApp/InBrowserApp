## Export ICS calendar events to CSV

Choose **ICS to CSV**, open or paste an iCalendar file, and select **Convert**. The spreadsheet has one row per event record and includes the event title, start, end, location, description, and recurrence rule where present. Download the CSV to review or edit in Excel or Google Sheets. An all-day event uses a date-only value and its end is exclusive. For example, an event occupying May 12 ends on May 13.

## Create an ICS file from CSV rows

Choose **CSV to ICS** and start with **Try an example** to see the headers. Include at least a `Title` and a `Start` column. Use `2026-05-12` for an all-day event, `2026-05-12T09:00:00` for a local time, or `2026-05-12T09:00:00Z` for UTC. The tool also recognizes Google Calendar headers such as `Subject`, `Start Date`, `Start Time`, and `All Day Event`. Download the ICS file to import the events into your calendar.

## Keep the original calendar for a full backup

CSV captures event details in rows. Repeating series are represented by their rules, without generating individual dates. Embedded time zone definitions are retained. Attachments, alarms, attendees, recurrence exclusions, and cancellation status stay in the original calendar. The conversion runs in your browser.
