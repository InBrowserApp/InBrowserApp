## Understand Cron Schedules Before You Ship Them

Cron expressions are compact, but a small field mistake can run a job far more often, or far less often, than intended. This parser validates the expression in your browser, explains the schedule in plain language, breaks down every field, and previews upcoming run times.

### When To Use It

- Check a deployment, backup, cleanup, or notification schedule before adding it to a server, CI system, or task runner.
- Compare a copied cron expression with the schedule you actually expect.
- Teach or debug cron syntax by changing one field at a time and watching the explanation update.

### Supported Format

The tool supports standard five-field Unix cron expressions: minute, hour, day of month, month, and day of week. It also accepts a six-field expression with seconds at the front for schedulers that support second-level precision.

### Reading The Result

The summary gives a plain-language description, while the field table shows how the raw expression is split. The upcoming run times use your browser's local time zone, so compare them with the time zone used by the scheduler that will run the job.

### Notes

- Day-of-week values commonly use `0` or `7` for Sunday, and names such as `MON` or `FRI` are also accepted.
- Month names such as `JAN` or `DEC` can make production schedules easier to review.
- If your scheduler uses a different cron dialect, confirm special tokens such as `?`, `L`, `W`, or `#` in that scheduler's own documentation.
