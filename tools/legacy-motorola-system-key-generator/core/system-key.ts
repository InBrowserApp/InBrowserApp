/**
 * @license ISC
 * Adapted from K4YT3X's BatLabs-derived syskey-batlab implementation:
 * https://github.com/k4yt3x/syskey-batlab/tree/19735068671aee0ec9ca845a5ebe210d59a90e4c
 *
 * Copyright (c) 2022 K4YT3X
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const HEADER = [
  0x2c, 0xb5, 0x32, 0xb3, 0x88, 0x0d, 0x6a, 0xdf, 0x4b, 0xb4, 0xe9, 0x95, 0x2c,
  0x6d, 0x1c, 0x03, 0x37, 0x24, 0x1f, 0x5b, 0x93, 0xbf, 0x24, 0x1a,
]

const V = "107654BA98FEDC32"
const W = "A9876543210"
const Y = "AB89EF6D23016745"
const Z = "1032547698BADCFE"

// Rows correspond to the first digit; columns to a second digit of B–F.
// Preserve the reference's repeated mappings, including 3D/3E, 4D/4E, 5D/5E.
const VW = [
  "0F0E0D0C0B",
  "7F7E7D7C7B",
  "6F6E6D6C6B",
  "5F5E5C5C5B",
  "4F4E4C4C4B",
  "BFBEBCBCBB",
  "AFAEADACAB",
  "9F9E9D9C9B",
  "8F8E8D8C8B",
  "FFFEFDFCFB",
  "EFEEEDECEB",
  "DFDEDDDCDB",
  "CFCECDCCCB",
  "3F3E3D3C3B",
  "2F2E2D2C2B",
  "1F1E1D1C1B",
]

export function normalizeSystemId(input: string): string | null {
  const trimmed = input.trim()
  return /^[0-9a-f]{1,4}$/i.test(trimmed)
    ? trimmed.toUpperCase().padStart(4, "0")
    : null
}

export function createLegacySystemKey(input: string) {
  const systemId = normalizeSystemId(input)
  if (!systemId) throw new Error("Invalid legacy System ID")

  const first = Number.parseInt(systemId.charAt(0), 16)
  const second = Number.parseInt(systemId.charAt(1), 16)
  const third = Number.parseInt(systemId.charAt(2), 16)
  const fourth = Number.parseInt(systemId.charAt(3), 16)
  const offset = (second - 0xb) * 2
  const highByte = Number.parseInt(
    second >= 0xb
      ? VW[first]!.slice(offset, offset + 2)
      : V.charAt(first) + W.charAt(second),
    16
  )
  const lowByte = Number.parseInt(Y.charAt(third) + Z.charAt(fourth), 16)

  return {
    systemId,
    filename: `SYS0${systemId}.KEY`,
    bytes: new Uint8Array([...HEADER, highByte, 0xff, lowByte]),
  }
}
