#!/bin/sh
# Requires Git, Rust with wasm32-unknown-unknown, and wasm-pack 0.15.0 (Rust 1.98.1 for the checked-in artifact).
set -eu
output=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
build=$(mktemp -d)
trap 'rm -rf "$build"' EXIT
git clone https://github.com/extend-hq/react-pptx.git "$build/source"
git -C "$build/source" checkout 222edd030e71d1772eaae11daac86dc80fb2720b
git -C "$build/source" apply "$output/parser.patch"
(cd "$build/source" && wasm-pack build crates/pptx-wasm --target web --out-dir "$build/wasm" --release)
cp "$build/wasm/pptx_wasm_bg.wasm" "$output/parser.wasm"
