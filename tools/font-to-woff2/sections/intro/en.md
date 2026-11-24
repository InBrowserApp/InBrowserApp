## How to convert TTF or OTF to WOFF2

Choose one or more TrueType (`.ttf`) or OpenType (`.otf`) font files, or drag them into the converter. Conversion starts as soon as you add the files. When a font is ready, compare the original and WOFF2 file sizes and select **Download WOFF2**. For example, `Inter-Regular.ttf` becomes `Inter-Regular.woff2`. All font processing happens in your browser, so the files stay on your device.

## Why use WOFF2 for web fonts?

WOFF2 (Web Open Font Format 2) packages font data with Brotli compression. Compared with serving the original TTF or OTF, WOFF2 usually transfers fewer bytes. The savings depend on the font. Format conversion keeps the full set of glyphs and preserves variable font axes, so one variable font file can still cover a range of weights. If your site only uses a particular set of characters, use a [font subset generator](../font-subset-generator/) to reduce the file further.

## How to use a WOFF2 file in CSS

Put the downloaded file in your site's fonts folder and reference it with `@font-face`. Match the path, weight, and style to the file you are serving. This example loads a regular font from `/fonts/` and displays fallback text while it loads.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

For a variable font, use the weight range the font actually supports, such as `font-weight: 100 900;`. Check the font's license before hosting it on a website, and test the languages and weights your pages use. See [MDN's @font-face reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
