## Generate random calendar dates within a range

Enter a **Start date** and **End date**, choose an output format, and select **Generate**. Both endpoints are included, so a range from `2024-02-28` to `2024-03-01` can also produce the leap day `2024-02-29`. The same date can appear multiple times in a batch. Copy the results or download a `UTF-8` text file with one date per line.

## Choose ISO or a localized date

Use **ISO (YYYY-MM-DD)** for test fixtures, spreadsheet imports, or dates that sort in calendar order as text. Use **Localized date** to display the Gregorian date in the page language. For example, `2024-02-29` appears as `Feb 29, 2024` on the English page and `29.02.2024` on the German page.

## Use the same calendar day across time zones

The range uses UTC day boundaries. A date picked at either end of the range stays on that calendar day wherever you display the generator. Setting the same start and end date generates that one date, which is useful when testing leap days or the first or last day of a month.
