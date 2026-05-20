## What the tool generates

This generator turns a single image into a complete, modern favicon bundle —
a multi-size `.ico` for legacy browsers, the 16 / 32 / 180 / 192 / 512
PNG variants, an optional original `.svg`, a `site.webmanifest` for PWAs,
and the HTML snippet you paste into `<head>`. Every byte is produced in
your browser; no upload, no server, no analytics.

## What's in the bundle

- `favicon.ico` — multi-image (16 / 32 / 48) for browser tabs, bookmarks,
  and old Windows shortcuts.
- `favicon-16x16.png` and `favicon-32x32.png` — modern PNG variants used by
  current browsers.
- `favicon.svg` — included only when your source image is SVG and the
  "Use original SVG" toggle is on.
- `apple-touch-icon.png` — 180×180, opaque, used by iOS home screens.
- `pwa-192x192.png` and `pwa-512x512.png` — the standard PWA icons.
- `pwa-maskable-192x192.png` and `pwa-maskable-512x512.png` — maskable
  variants with the W3C-recommended safe area.
- `site.webmanifest` — the PWA manifest wired to the icons above.

## How padding, background, and maskable safe zones work

Each platform has its own padding ("Margin") so you can leave breathing room
inside the icon canvas. The "Add background" switch paints an opaque square
behind your source — useful when the source is transparent and the
destination requires opacity (Apple's home screen) or just for visual
contrast in a browser tab. Maskable PWA icons use an extra safe zone
on top of the platform margin: anything outside the central ~80% may be
cropped by Android, Windows, or ChromeOS when they apply a circular,
rounded, or squircle mask.

## Wiring the bundle into your site

1. Unzip the downloaded archive into your web root (so the files live at
   `/favicon.ico`, `/site.webmanifest`, etc.).
2. Paste the HTML snippet into your site's `<head>`.
3. If you serve assets from a sub-path (for example `/static/icons/`),
   set "Asset path" before generating so the snippet and manifest use the
   right URLs.
4. If you customized the manifest beyond what this tool exposes (for
   example to add `categories` or `screenshots`), open `site.webmanifest`
   in a text editor and edit it directly — it's plain JSON.
