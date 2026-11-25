import { describe, expect, it } from "vitest"

import { convertAddress } from "./address"

// EIP-55 vectors and their delegated encodings. The first was also checked
// with Lotus EthAddressToFilecoinAddress on mainnet and Calibration.
const eth = "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
const mainnet = "f410flkxlmbj7h2kmtonat4zwnfbv47xrx2xn5yjm6ma"
const calibration = "t410flkxlmbj7h2kmtonat4zwnfbv47xrx2xn5yjm6ma"
const masked = "0xff00000000000000000000000000000000000064"

describe("Filecoin FEVM address conversion", () => {
  it.each([eth, eth.toLowerCase(), eth.toUpperCase()])(
    "accepts Ethereum address %s",
    (input) => {
      expect(convertAddress(` ${input} `, "f")).toEqual({
        address: mainnet,
        format: "filecoin",
        network: "f",
      })
    }
  )

  it("writes the network selected for hex addresses", () => {
    expect(convertAddress(eth, "t")).toEqual({
      address: calibration,
      format: "filecoin",
      network: "t",
    })
  })

  it("infers the network and emits EIP-55 checksums for delegated inputs", () => {
    expect(convertAddress(mainnet, "t")).toEqual({
      address: eth,
      format: "ethereum",
      network: "f",
    })
    expect(convertAddress(calibration, "f")).toEqual({
      address: eth,
      format: "ethereum",
      network: "t",
    })
    expect(
      convertAddress("f410f7nurmck4uhpwbo3zz2jm4pvhjq34lu2zlaf2tzy", "f")
    ).toMatchObject({ address: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359" })
    expect(
      convertAddress("f410faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaonc6iji", "f")
    ).toMatchObject({ address: "0x0000000000000000000000000000000000000000" })
  })

  it("rejects a mixed-case hex address with a mismatched EIP-55 checksum", () => {
    expect(convertAddress(eth.replace("5aA", "5AA"), "f")).toEqual({
      problem: "ethereumChecksum",
    })
  })

  it("rejects delegated addresses with a wrong checksum", () => {
    expect(convertAddress(mainnet.slice(0, -1) + "i", "f")).toEqual({
      problem: "filecoinChecksum",
    })
  })

  it.each([
    "",
    "f0100",
    "f1ospzn44la6urbk32zdponu2g76c63nmpkggtvej",
    "0x5aaeb6053f3e94c9b9a09f33669435e7ef1beae",
    "0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaeg",
    mainnet.toUpperCase(),
    mainnet.replace("410", "411"),
    mainnet + "=",
    mainnet.slice(0, -1) + "b",
  ])("rejects unsupported or malformed input %s", (input) => {
    expect(convertAddress(input, "f")).toEqual({ problem: "invalidAddress" })
  })

  it("rejects masked Filecoin actor IDs in either format", () => {
    expect(convertAddress(masked, "f")).toEqual({ problem: "actorId" })
    expect(
      convertAddress("f410f74aaaaaaaaaaaaaaaaaaaaaaaaaaaadep73vx2q", "f")
    ).toEqual({ problem: "actorId" })
    expect(
      convertAddress("0xff01000000000000000000000000000000000064", "f")
    ).toMatchObject({ format: "filecoin" })
  })
})
