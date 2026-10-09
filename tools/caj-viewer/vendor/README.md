# Local CAJ conversion engine

`caj2pdf_wasm.wasm` is an MIT-licensed build of
[caj2pdf-rust v0.6.1](https://github.com/rwv/caj2pdf-rust/tree/6349d660bdc04c34753a5d108c25c651929b7bc8)
(commit `6349d660bdc04c34753a5d108c25c651929b7bc8`) with
`jpeg-orientation.patch`. The JavaScript worker wrapper is the catalog-pinned
`caj2pdf-rust` 0.6.1 package. Its conversion and worker code are unchanged.
The repository's `patches/caj2pdf-rust@0.6.1.patch` makes the unused browser
`loadModule` helper require an explicit URL, removing its default reference
to the original WASM. Otherwise Vite emits the original asset even after
discarding that unused helper. The application fetches and compiles this
patched WASM directly with cancellation support.

The upstream HN/C8 composer corrected top-first decoded bilevel rows but
left JPEG streams under a negative-height image transform. This vertically
reflected an original NH cover and an invented four-color JPEG. The patch
places JPEG rows top-first too, preserving each source image's rectangle,
ordering and bytes. It changes HN/C8 image placement only; it does not rotate
whole pages or inspect their visual content. Decoded type-0/type-3 images
retain their existing placement. Native mixed-page image placement uses
the same row convention, although external native fonts are not enabled by
this viewer.

The patch also updates the existing geometry expectations and changes the
upstream asymmetric JPEG render test to compare with original image rows.
It checks grayscale and RGB JPEGs for HN-A types 1/2, C8 types 1/2 and HN-B
type 2. Full-page pixel comparison and nonzero image origins are separate
regressions. The application has an actual-WASM regression using an owned
JPEG control and the shared CAJ/KDH/bilevel fixtures.

## Rebuilding

Use Rust 1.98.1, the upstream pinned toolchain, with the
`wasm32-unknown-unknown` target. `Cargo.lock` comes from the pinned commit.
Run from an otherwise clean temporary directory, with `viewer_vendor`
pointing to this directory:

```sh
git clone https://github.com/rwv/caj2pdf-rust.git caj2pdf-source
cd caj2pdf-source
git checkout --detach 6349d660bdc04c34753a5d108c25c651929b7bc8
git apply "$viewer_vendor/jpeg-orientation.patch"
cargo build --locked --release --all-features -p caj2pdf-wasm --target wasm32-unknown-unknown
cp target/wasm32-unknown-unknown/release/caj2pdf_wasm.wasm "$viewer_vendor/caj2pdf_wasm.wasm"
sha256sum "$viewer_vendor/caj2pdf_wasm.wasm"
```

The asset is 1,652,188 bytes. SHA-256:

```text
64503c544bd8e239f88cd22d92cd3a97790fbbcfb8249ca8830f7908b12b2d86
```

The Rust render regression needs `cjpeg`, `djpeg` and MuPDF's `mutool`.
It generates original pixels at runtime and uses no third-party documents:

```sh
cargo test --locked -p caj2pdf-core --test hnc8_type2_pdf original_asymmetric_pgm_ppm_pixels_keep_top_first_orientation_and_color
cargo test --locked -p caj2pdf-core --test hnc8_type0_pdf --test hnc8_type3_pdf
cargo test --locked -p caj2pdf-core --lib
```

Retain `LICENSE` with redistributed builds. Genuine NH files used to verify
the correction are not distributed; see `../compatibility.md` for provenance.
