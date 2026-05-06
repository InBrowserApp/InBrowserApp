## Build Cron Schedules Visually

Cron expressions are compact, but a small change in the wrong field can move a job from "weekday mornings" to "every minute." This generator gives each field its own controls so you can build a standard five-field expression without memorizing every syntax rule.

### When It Helps

- Create schedules for CI jobs, backups, cache warmers, reports, and other recurring tasks.
- Start from a known preset and fine-tune one field at a time.
- Preview upcoming local run times before pasting the expression into a scheduler.

### How to Use It

1. Pick a quick preset, or keep the default expression and edit each field manually.
2. Choose whether each field should run on every value, an interval, specific values, or a range.
3. Review the generated expression and the next run preview, then copy it into your scheduler.

### Notes

- This tool generates standard five-field cron: minute, hour, day of month, month, and day of week.
- Sunday is shown as `0`, which is accepted by common Unix-style cron schedulers.
- If both day of month and day of week are restricted, many cron implementations run when either field matches. Some systems differ, so verify that combination in your target scheduler.
