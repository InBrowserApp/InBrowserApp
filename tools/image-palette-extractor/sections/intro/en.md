## What this tool does

Image Palette Extractor finds the dominant colors in an image directly in
your browser. It samples the picture, groups visually similar pixels, and
returns a practical palette with HEX, RGB, HSL, and percentage values for
each color.

## Good use cases

- Pull brand or product colors from a screenshot, logo, photo, or mockup.
- Build a quick CSS palette for a landing page, thumbnail, or design handoff.
- Compare how much of an image is driven by one dominant color versus
  supporting accents.
- Work with private images without sending the file to a server.

## Export options

The result can be copied as a plain HEX list, CSS custom properties, or JSON.
The CSS format is useful when you want variables such as `--palette-1`, while
JSON keeps the color formats and dominance ratio together for scripts or design
automation.

## Things to watch for

- Palette extraction is approximate. It is meant to produce useful visual
  groups, not a complete inventory of every pixel color.
- Transparent pixels are ignored by default so icons and cutouts do not skew
  the palette; turn that off when transparency itself is part of the artwork.
- The precise quality setting samples more pixels and can be slower on very
  large images.
