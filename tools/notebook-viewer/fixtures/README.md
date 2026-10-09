# Notebook viewer fixtures

`survey.ipynb` is an original nbformat 4 notebook for this repository. Its seven
cells contain Markdown with multilingual text and a percent-encoded bookmark,
Python source, execution counts, saved stream text, an HTML table, a static SVG
plot, a cell-local PNG attachment, a cell with no saved output, literal raw text,
and an ANSI-colored saved traceback. The PNG is an original one-pixel RGBA image
with valid PNG chunk CRCs.

`unavailable.ipynb` is an original adversarial example. It includes a missing
attachment, a remote Markdown image, a widget with a plain-text alternative,
active HTML, a remote SVG image, and a future cell type with retained source.
All `example.invalid` URLs are deliberate network-blocking probes.

The browser checks also used unchanged official Jupyter examples from
[jupyter/notebook](https://github.com/jupyter/notebook/tree/1e4464c7e8af3dd3eae30e3d482a3f6a95643811/docs/source/examples/Notebook)
at commit `1e4464c7e8af3dd3eae30e3d482a3f6a95643811`:

| Example                            | Cells | SHA-256                                                            |
| ---------------------------------- | ----: | ------------------------------------------------------------------ |
| Running Code.ipynb                 |    28 | `29fb6234ed3bd6960433e7265b17922de509e62a3558ddab3926bdfb66fe1d73` |
| Working With Markdown Cells.ipynb  |    24 | `21c27aabbd9ce89397929b28dc73b3f42ce47783239aa5f8d1a6853db65ba050` |
| What is the Jupyter Notebook.ipynb |    13 | `77a58c94db25dfe1937e3a7484c915875b9f40a4ce67a38a515741626f6cd111` |
| Typesetting Equations.ipynb        |    11 | `c2acc0bfaac92a550f3bff7bf9c57582e05838a9239b8c01561770316e2f3352` |

Those upstream BSD-licensed examples were downloaded for validation and are not
redistributed here. The first example contains saved streams, not saved plots;
the authored fixture separately exercises tables, raster images, and SVG plots.
