Generate a UUID v4 locally in your browser when you need a fresh identifier for test records, database rows, API examples, event payloads, fixtures, or configuration files. The tool creates one canonical lowercase UUID at a time so it stays focused on the single-value workflow without overlapping the separate bulk generator.

## What UUID v4 Means

A UUID v4 is a 128-bit identifier where the version and variant bits are fixed and the remaining 122 bits come from random data. That makes it useful when you need identifiers that do not reveal creation time, machine information, sequence counters, or user details.

## When To Use It

Use UUID v4 for client-generated IDs, mock objects, temporary records, public examples, and distributed systems where coordinating a central counter would be awkward. It is a good default when sort order is not important and you only need a low-collision identifier.

## Privacy And Reliability

Generation runs in this browser tab with Web Crypto, so the UUID is not sent to InBrowser.App or another service. Copy the value once it looks right, then regenerate whenever you need a fresh identifier for the next record or example.
