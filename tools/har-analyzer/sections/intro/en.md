## Open a HAR capture

Export a HAR (HTTP Archive) file from your browser’s Network panel after recording the requests you want to investigate. Open or drop the `.har` or `.json` file here, or load the example. The file limit is 20 MiB and 20,000 entries.

## Find slow or unsuccessful requests

Search by URL, method, status, or MIME type, then sort by start time, duration, or transferred size. Requests share one time scale, measured from the earliest request. Select one to inspect headers, cookies, parameters, bodies, and timing phases.

The failed filter includes status 0, 4xx, and 5xx. Status 0 means no HTTP response was recorded; the 3xx filter includes 304 cache responses. TLS is part of connection time.

## Read the recorded data

Processing stays in your browser. Available details depend on the export. Unknown sizes are excluded from totals; capture span is unavailable when a request duration is missing. The waterfall still uses recorded starts and known finishes.

Body previews preserve the recorded text. Previews and their copies, plus individual field values, are limited to 100,000 characters. Encoded bodies stay encoded.
