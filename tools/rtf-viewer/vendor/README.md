# RTF parser artifact

`rtf_parser_bg.wasm` is built from MIT-licensed
[`rwv/rtf-viewer`](https://github.com/rwv/rtf-viewer) commit
`d077653c92d4420126c145fcbf8332bbe1106ada` (published engine 1.3.1).
`parser-capacity.patch` changes parser content quotas to the platform's
representable storage range and updates the quota regressions. It does not
change format parsing or remove decoded bitmap allocation guards. The RTF
format's nine list levels and the diagnostic aggregation budget remain.

Reproduce with Rust 1.98.1 and wasm-bindgen-cli 0.2.128. Build path
remapping removes machine-specific Cargo cache paths from panic strings
(use the actual Cargo home path if it differs from `$HOME/.cargo`):

```sh
git clone https://github.com/rwv/rtf-viewer.git
cd rtf-viewer
git checkout d077653c92d4420126c145fcbf8332bbe1106ada
git apply /path/to/parser-capacity.patch
cargo test --workspace --locked
RUSTFLAGS="--remap-path-prefix=${HOME}/.cargo=/cargo --remap-path-prefix=${PWD}=/source" \
  cargo build --locked -p rtf-parser --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/rtf_parser.wasm --target web --out-dir output --out-name rtf_parser
sha256sum output/rtf_parser_bg.wasm
```

The package patch in `patches/rtf-viewer@1.3.1.patch` removes the JavaScript
input quota, disables the default parser timer, and permits uncapped
pagination. Cancellation still terminates the owned parser worker. Explicit
WASM URLs prevent bundling an unused unpatched artifact. The generated glue
and worker protocol are otherwise unchanged. Its image error messages distinguish
malformed image data from decoded-image allocation guards without changing
either guard. Optional caller-supplied page
limits and parser timers remain available to other integrations.

Canvas dimensions and decoded-image budgets are actual allocation safeguards,
not file or page quotas. Parser allocation failures are reported as browser
resource errors. Unsupported or malformed documents have separate feedback.

SHA-256: `5a6d0476234e5704f9f630d4c084179e32348e6812fae2ccaa1031ed2b2a2c8a`.
