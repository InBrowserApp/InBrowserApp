import { parseOnly } from "abcjs"
import { describe, expect, it } from "vitest"
import { prepareAbc } from "./source"

describe("prepareAbc", () => {
  it("normalizes CRLF and CR without changing a single tune or fragment", () => {
    expect(prepareAbc("X:1\r\nT:First\rK:D\nD2")).toBe("X:1\nT:First\nK:D\nD2")
    expect(prepareAbc("K:C\rCDEF|")).toBe("K:C\nCDEF|")
  })

  it("retains a header containing only directives", () => {
    const score = "%abc-2.1\n%%staffwidth 400\nX:1\nK:D\nD2"
    expect(prepareAbc(score)).toBe(score)
  })

  it("copies shared meter, note length, and tempo before the local fields of each tune", () => {
    const header = "%abc-2.1\nM:6/8\nL:1/16\nQ:1/8=168\n"
    const tuneOne = "X:1\nT:First\nK:C\nC D E F|\n\n"
    const tuneTwo = "X:2\nT:Second\nL:1/8\nK:C\nD E F G|"
    expect(prepareAbc(header + tuneOne + tuneTwo)).toBe(
      header +
        tuneOne.replace("X:1", "X:1\nM:6/8\nL:1/16\nQ:1/8=168") +
        tuneTwo.replace("X:2", "X:2\nM:6/8\nL:1/16\nQ:1/8=168")
    )
  })

  it("applies shared timing with a per-tune override in the actual parser", () => {
    const book =
      "%abc-2.1\rM:6/8\rL:1/16\rQ:1/8=168\r\rX:1\rT:First\rK:C\rCDEF|\r\rX:2\rT:Second\rL:1/8\rK:C\rDEFG|"
    const tunes = parseOnly(prepareAbc(book))
    expect(tunes.map((tune) => tune.getMeterFraction())).toEqual([
      { num: 6, den: 8 },
      { num: 6, den: 8 },
    ])
    expect(tunes.map((tune) => tune.getBpm())).toEqual([56, 56])
    expect(
      tunes.map((tune) => {
        const staff = tune.lines.find((line) => line.staff)?.staff?.[0]
        const note = staff?.voices[0]?.find((event) => event.el_type === "note")
        return note?.duration
      })
    ).toEqual([1 / 16, 1 / 8])
  })
})
