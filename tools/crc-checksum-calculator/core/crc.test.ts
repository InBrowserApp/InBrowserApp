import { describe, expect, test } from "vitest"

import {
  CRC_MODELS,
  calculateCrc,
  calculateCrcChecksums,
  calculateCrcChecksumsForBytes,
  formatCrcValue,
  type CrcModel,
} from "./crc"

const STANDARD_INPUT = new TextEncoder().encode("123456789")

describe("calculateCrc", () => {
  test("matches standard check vectors for every configured CRC model", () => {
    for (const model of CRC_MODELS) {
      expect(
        formatCrcValue(calculateCrc(STANDARD_INPUT, model), model.width)
      ).toBe(model.check)
    }
  })

  test("reflects the final value when input and output reflection differ", () => {
    const customModel: CrcModel = {
      id: "crc8-final-reflection",
      name: "CRC8 final reflection",
      width: "8",
      polynomial: 0x07n,
      initial: 0x00n,
      xorOutput: 0x00n,
      reflectInput: false,
      reflectOutput: true,
      check: "00",
    }

    expect(calculateCrc(new Uint8Array([0x01]), customModel)).toBe(0xe0n)
  })
})

describe("calculateCrcChecksumsForBytes", () => {
  test("returns all supported CRC variants in display order", () => {
    const results = calculateCrcChecksumsForBytes(STANDARD_INPUT)

    expect(results.map((result) => result.name)).toEqual([
      "CRC1",
      "CRC8",
      "CRC8 1-Wire",
      "CRC8 DVB-S2",
      "CRC16",
      "CRC16 CCITT",
      "CRC16 Modbus",
      "CRC16 Kermit",
      "CRC16 XModem",
      "CRC24",
      "CRC32",
      "CRC32 MPEG-2",
      "CRCJAM",
      "CRC64 ECMA-182",
      "CRC64 GO-ISO",
      "CRC64 MS",
      "CRC64 NVME",
      "CRC64 REDIS",
      "CRC64 WE",
      "CRC64 XZ",
    ])
  })

  test("includes legacy-compatible check values for the standard vector", () => {
    const results = calculateCrcChecksumsForBytes(STANDARD_INPUT)

    expect(
      Object.fromEntries(results.map(({ id, hex }) => [id, hex]))
    ).toMatchObject({
      crc1: "1",
      crc8: "f4",
      "crc8-1-wire": "a1",
      "crc8-dvb-s2": "bc",
      crc16: "bb3d",
      "crc16-ccitt": "29b1",
      "crc16-modbus": "4b37",
      "crc16-kermit": "2189",
      "crc16-xmodem": "31c3",
      crc24: "21cf02",
      crc32: "cbf43926",
      "crc32-mpeg-2": "0376e6e7",
      crcjam: "340bc6d9",
      "crc64-xz": "995dc9bbdf1939fa",
    })
  })
})

describe("calculateCrcChecksums", () => {
  test("hashes a blob input", async () => {
    const results = await calculateCrcChecksums(new Blob(["hello"]))

    expect(results.find((result) => result.id === "crc32")).toEqual({
      id: "crc32",
      name: "CRC32",
      width: "32",
      hex: "3610a686",
    })
  })
})

describe("formatCrcValue", () => {
  test("pads values to the expected width", () => {
    expect(formatCrcValue(0xfn, "8")).toBe("0f")
    expect(formatCrcValue(0xfn, "64")).toBe("000000000000000f")
  })
})
