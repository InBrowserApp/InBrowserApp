import { CID } from "multiformats/cid"
import { create as createDigest } from "multiformats/hashes/digest"
import { describe, expect, it, vi } from "vitest"

import { calculatePiece } from "./commitment"
import { comparePiece } from "./compare"

// https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md#test-cases
const pieceV2 =
  "bafkzcibcaaces3nobte6ezpp4wqan2age2s5yxcatzotcvobhgcmv5wi2xh5mbi"
const pieceV1 =
  "baga6ea4seaqes3nobte6ezpp4wqan2age2s5yxcatzotcvobhgcmv5wi2xh5mbi"
const pieceHex =
  "f01559120220004496dae0cc9e265efe5a006e80626a5dc5c409e5d3155c13984caf6c8d5cfd605"
const emptyV2 =
  "bafkzcibcp4bdomn3tgwgrh3g532zopskstnbrd2n3sxfqbze7rxt7vqn7veigmy"
const expected = { pieceCid: pieceV2, legacyCid: pieceV1, paddedSize: 512n }

describe("Filecoin piece commitments", () => {
  it("matches the FRC-0069 vectors for both wire formats", async () => {
    const file = new Blob([0, 1, 2, 3].map((n) => new Uint8Array(127).fill(n)))
    const progress = vi.fn()
    await expect(calculatePiece(file, progress)).resolves.toEqual(expected)
    expect(progress).toHaveBeenCalledExactlyOnceWith(file.size)
  })

  it("distinguishes trailing payload zeros from padding in v2", async () => {
    const data = [0, 1, 2, 3].map((n) => new Uint8Array(127).fill(n))
    const padded = await calculatePiece(
      new Blob([...data, new Uint8Array(4)]),
      vi.fn()
    )
    const longer = await calculatePiece(
      new Blob([...data, new Uint8Array(5)]),
      vi.fn()
    )
    expect(longer.legacyCid).toBe(padded.legacyCid)
    expect(longer.paddedSize).toBe(padded.paddedSize)
    expect(longer.pieceCid).not.toBe(padded.pieceCid)
  })

  it.each([
    [0, 128n, emptyV2],
    [
      1,
      128n,
      "bafkzcibcpyba3vw24qoc65kvaeuvst5witskqqwpv6zrniwvsmq6hch6qsq6yly",
    ],
    [
      64,
      128n,
      "bafkzcibch4beda6pru25m2g5kbvsnsj3za7le45vcauwicz2wsmjs43q3dajkpy",
    ],
    [
      128,
      256n,
      "bafkzcibcpybwiktap34inmaex4wbs6cghlq5i2j2yd2bb2zndn5ep7ralzphkdy",
    ],
  ])(
    "formats the padding boundary for a %d-byte payload",
    async (size, paddedSize, pieceCid) => {
      const bytes = new Uint8Array(size).fill(size < 128 ? 1 : 0)
      await expect(
        calculatePiece(new Blob([bytes]), vi.fn())
      ).resolves.toMatchObject({
        paddedSize,
        pieceCid,
      })
    }
  )

  it("reads larger files in chunks and reports increasing progress", async () => {
    const part = new Uint8Array(1024 * 1024).fill(17)
    const file = new Blob([part, part, part])
    const slice = vi.spyOn(file, "slice")
    const progress = vi.fn()
    const result = await calculatePiece(file, progress)
    expect(slice.mock.calls).toEqual([
      [0, part.length],
      [part.length, 2 * part.length],
      [2 * part.length, 3 * part.length],
    ])
    expect(progress.mock.calls).toEqual([
      [part.length],
      [2 * part.length],
      [3 * part.length],
    ])
    expect(result.paddedSize).toBe(4_194_304n)
  })
})

describe("Piece CID comparison", () => {
  it("matches both formats and alternate multibase representations", () => {
    for (const value of [pieceV2, pieceV1, pieceHex, pieceV2.toUpperCase()]) {
      expect(comparePiece(` ${value} `, expected)).toBe("match")
    }
  })

  it("distinguishes a different commitment from invalid input", () => {
    const otherLegacy = CID.createV1(
      0xf101,
      createDigest(0x1012, new Uint8Array(32))
    )
    expect(comparePiece(emptyV2, expected)).toBe("different")
    expect(comparePiece(otherLegacy.toString(), expected)).toBe("different")
    expect(comparePiece("folder.car", expected)).toBe("invalid")
    expect(
      comparePiece("QmYwAPJzv5CZsnAzt8auVZRnL1aRgXDNePryCrRnsQ9ctM", expected)
    ).toBe("invalid")
  })

  it.each([
    "bafkzcibd7qbqlxticxolgseegik2stpfgkkuwyf6kufex3doorkvmzpjuxwe4dz4",
    "bafkzcibcaaa7ljp5iliwuibqe6mo63wtbglzwqyahursbwpq5dvjqmnje5m7wcy",
  ])("rejects the specification's invalid vector %s", (input) => {
    expect(comparePiece(input, expected)).toBe("invalid")
  })

  it.each([
    [],
    [128],
    [128, 0],
    [0, 1],
    [128, 1],
    [128, 128, 128, 128, 128, 128, 128, 128, 128, 1],
  ])("rejects malformed or excessive padding %j", (...padding) => {
    const bytes = new Uint8Array([...padding, 2, ...new Uint8Array(32)])
    const cid = CID.createV1(0x55, createDigest(0x1011, bytes))
    expect(comparePiece(cid.toString(), expected)).toBe("invalid")
  })

  it("rejects an incorrect legacy digest length and unrelated multihashes", () => {
    for (const cid of [
      CID.createV1(0xf101, createDigest(0x1012, new Uint8Array(31))),
      CID.createV1(0x55, createDigest(0x12, new Uint8Array(32))),
    ]) {
      expect(comparePiece(cid.toString(), expected)).toBe("invalid")
    }
  })
})
