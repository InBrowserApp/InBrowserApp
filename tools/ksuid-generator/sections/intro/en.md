Generate KSUIDs locally in your browser without sending the current batch to another service. This tool is useful when you need identifiers that stay unique across distributed systems while still sorting roughly by creation time for logs, feeds, imports, or ordered records.

## Why Use KSUID

KSUID combines a 32-bit timestamp with 128 bits of randomness and encodes the result as a 27-character Base62 string. That makes each ID compact, URL-friendly, and easy to store, while the embedded timestamp keeps newer values generally sorted after older ones.

## Choose Current Or Custom Time

Use the current time when you want fresh IDs for production data, demos, or routine batch generation. Switch to a custom timestamp when you need reproducible fixtures, backfilled records, migration samples, or test cases that should appear to come from a specific moment.

## Things To Know Before You Export

KSUID keeps only second-level precision, so any millisecond input is rounded down to the start of that second. IDs created in the same second are still unique, but their final ordering depends on the random payload, so treat KSUID as time-sortable rather than strictly sequential.
