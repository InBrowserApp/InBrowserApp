## What is Local Font Access?

Local Font Access is a browser API that lists the fonts installed on your device.

This tool lets you search the results, compare related faces, and copy a CSS snippet for the font you pick.

It only works in secure contexts and supported browsers, and requires user permission (local-fonts).

The API returns FontData with family, fullName, postscriptName, and style metadata.

### Key points

- Use it to confirm the exact names you need for a CSS `font-family` stack on the current device.
- Calls must be triggered by a user gesture.
- Permissions Policy can block access on some sites.
- This tool stays on-device and does not upload fonts.
