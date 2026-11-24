## How to sanitize a HAR file

A HAR (HTTP Archive) records browser network requests and responses. It can contain session cookies, authorization tokens, URLs, and payloads with private data. Use this tool to make a cleaned copy for a support ticket, bug report, or teammate while keeping the method, status code, and timing of each request.

1. Open your browser’s developer tools and go to **Network**. Reproduce the problem, then export the log as a HAR file. In Chrome, choose **Export HAR (sanitized)** for a copy with standard credential headers already removed.
2. Open or drop the exported HAR here. The tool prepares a copy as soon as you select a file. Try the example to see what changes with a sample capture.
3. Review the counts, then choose **Download sanitized HAR**. The new file ends in `.sanitized.har` and can be imported into DevTools or the [HAR Network Analyzer](/tools/har-analyzer/). Processing takes place in your browser.

## What gets removed or masked?

Cookies and common authentication headers, including `Authorization` and `X-API-Key`, are removed. By default the tool masks URL parameter values and strips request, response, and recorded WebSocket payloads. For example, `?token=example&page=2` becomes `?token=REDACTED&page=REDACTED` in the export. Parameter names remain available for debugging. The counts include every field changed, even when the same value appears in multiple fields.

Turn off the corresponding option when you need the original parameter values or bodies to reproduce a problem. Hosts, URL paths, ordinary headers, and browser-specific metadata can still contain private information. Review these fields before sharing the file.
