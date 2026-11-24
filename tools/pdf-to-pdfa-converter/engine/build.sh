#!/usr/bin/env bash
set -euo pipefail

engine="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Emscripten 4.0.10 also pins the versions and checksums of the JPEG and zlib ports.
if [[ "$(emcc --version)" != *4.0.10* ]]; then
  echo 'Use Emscripten 4.0.10 to rebuild the shipped assets.' >&2
  exit 1
fi
fetch() {
  git init --quiet "$work/$1"
  git -C "$work/$1" fetch --quiet --depth 1 "$2" "$3"
  git -C "$work/$1" checkout --quiet --detach FETCH_HEAD
}
fetch fynepdf https://github.com/fynepdf/fynepdf-pdfa.git cc8016132da8dbf5252ed6a8c956885518ce0030
fetch qpdf https://github.com/qpdf/qpdf.git 4eba95899886e851cc41d76886483b347612f2a8
fetch openjpeg https://github.com/uclouvain/openjpeg.git 6c4a29b00211eb0430fa0e5e890f1ce5c80f409f
fetch lcms https://github.com/mm2/Little-CMS.git 7717fce0d85447ef3b2df0cca2e99207c15eeecd

embuilder build zlib libjpeg
sysroot="$(em-config CACHE)/sysroot"
ports_lib="$sysroot/lib/wasm32-emscripten"
ports_include="$sysroot/include"

emcmake cmake -S "$work/qpdf" -B "$work/qpdf-build" -G Ninja \
  -DCMAKE_BUILD_TYPE=Release '-DCMAKE_CXX_FLAGS=-fexceptions' \
  -DBUILD_SHARED_LIBS=OFF -DBUILD_DOC=OFF -DINSTALL_EXAMPLES=OFF \
  -DUSE_IMPLICIT_CRYPTO=OFF -DREQUIRE_CRYPTO_NATIVE=ON \
  -DZLIB_LIBRARY="$ports_lib/libz.a" -DZLIB_INCLUDE_DIR="$ports_include" \
  -DJPEG_LIBRARY="$ports_lib/libjpeg.a" -DJPEG_INCLUDE_DIR="$ports_include"
cmake --build "$work/qpdf-build" --target libqpdf.a

emcmake cmake -S "$work/openjpeg" -B "$work/openjpeg-build" -G Ninja \
  -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DBUILD_CODEC=OFF -DBUILD_TESTING=OFF
cmake --build "$work/openjpeg-build" --target openjp2

emcmake cmake -S "$engine" -B "$work/engine" -G Ninja \
  -DCMAKE_BUILD_TYPE=Release '-DCMAKE_CXX_FLAGS=-fexceptions' \
  -DFYNEPDF_SOURCE="$work/fynepdf" -DLCMS_SOURCE="$work/lcms" \
  -DQPDF_SOURCE="$work/qpdf" -DQPDF_BUILD="$work/qpdf-build" \
  -DOPENJPEG_SOURCE="$work/openjpeg" -DOPENJPEG_BUILD="$work/openjpeg-build" \
  -DPORTS_LIB="$ports_lib" -DPORTS_INCLUDE="$ports_include"
cmake --build "$work/engine"
mkdir -p "$engine/generated"
sed 's/[[:blank:]]*$//' "$work/engine/fynepdf.mjs" > "$engine/generated/fynepdf.mjs"
gzip -n -9 < "$work/engine/fynepdf.wasm" > "$engine/generated/fynepdf.bin"
