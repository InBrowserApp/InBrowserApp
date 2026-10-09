# Local math styling

`math.css` is adapted from the published `pulldown-latex` 0.8.0 crate's `styles.css`. Only the downloadable font declarations and their explicit font-family rules were removed. Native browser math fonts are used. The layout rules, including aligned equations, matrices, borders, and negated operators, are retained. No document resources or fonts are fetched.

Source: https://static.crates.io/crates/pulldown-latex/pulldown-latex-0.8.0.crate

Original stylesheet SHA-256: `58bca1120d691c6823a46d6a5d9dabed59363e33fcaa0d4a312d32d4d388d3dc`.

The renderer's npm package supplies its version-matched article stylesheet and WASM. Vite emits the WASM as a local asset from the public `faster-latex/web` entrypoint; no patched package exports or external CDN are needed. Published MIT notices are served at `/licenses/latex-previewer.txt`.
