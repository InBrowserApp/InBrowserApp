## What this tool is for

Use this tool to compare your device clock with a network-sourced time
reading. It fetches a timestamp from Cloudflare's trace endpoint, estimates
the midpoint of request latency, and shows the resulting network clock in your
browser.

## Where it helps

- Checking whether your local system clock is ahead or behind.
- Confirming time drift before troubleshooting TLS, tokens, schedulers, or
  logs.
- Getting a quick network-based reference time without installing NTP tools.

## What to watch for

- The displayed offset is an estimate and depends on network latency.
- If the trace request fails, the tool falls back to your local clock until
  the next successful sync.
- For a precise system-wide fix, adjust your device time sync settings or NTP
  configuration.
