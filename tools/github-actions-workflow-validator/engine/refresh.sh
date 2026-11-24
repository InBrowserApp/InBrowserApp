#!/bin/sh
set -eu
cd "$(dirname "$0")/go"
export GOTOOLCHAIN=go1.26.11
GOOS=js GOARCH=wasm go build -trimpath -ldflags="-s -w" -o ../vendor/actionlint.wasm .
chmod 644 ../vendor/actionlint.wasm
go_root=$(go env GOROOT)
cp "$go_root/lib/wasm/wasm_exec.js" ../vendor/wasm_exec.js
cp "$go_root/LICENSE" ../vendor/GO-LICENSE.txt
GOOS=js GOARCH=wasm go list -deps -f '{{with .Module}}{{if .Version}}{{.Path}}|{{.Version}}|{{.Dir}}{{end}}{{end}}' . |
  LC_ALL=C sort -u |
  while IFS='|' read -r module version directory; do
    [ -n "$module" ] || continue
    printf '\n===== %s %s =====\n' "$module" "$version"
    for notice in "$directory"/LICENSE* "$directory"/NOTICE* "$directory"/PATENTS; do
      [ -f "$notice" ] || continue
      cat "$notice"
    done
  done > ../vendor/THIRD-PARTY-LICENSES.txt
