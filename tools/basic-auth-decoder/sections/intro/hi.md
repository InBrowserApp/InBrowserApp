## What It Does

HTTP Basic Authorization हेडर को डिकोड कर Base64 से उपयोगकर्ता नाम और पासवर्ड निकालें। डिबगिंग और API परीक्षण के लिए उपयोगी.

## Accepted Input

ऐसा हेडर पेस्ट करें: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
