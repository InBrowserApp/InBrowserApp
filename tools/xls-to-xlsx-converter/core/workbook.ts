import { CFB, read, set_cptable } from "xlsx"
import * as cptable from "xlsx/dist/cpexcel.full.mjs"
set_cptable(cptable)

export function assertXls(bytes: Uint8Array) {
  const compound = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
    (value, index) => bytes[index] === value
  )
  if (compound) {
    const archive = CFB.read(bytes, { type: "buffer" })
    if (
      CFB.find(archive, "EncryptedPackage") ||
      CFB.find(archive, "EncryptionInfo")
    )
      throw new Error("protected")
    if (!CFB.find(archive, "Workbook") && !CFB.find(archive, "Book"))
      throw new Error("invalid")
    return
  }
  // Raw BIFF 2–8 starts with a BOF record; text and renamed OOXML do not.
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x09 ||
    ![0, 2, 4, 8].includes(bytes[1]!)
  )
    throw new Error("invalid")
}

export function readXls(bytes: Uint8Array) {
  assertXls(bytes)
  return read(bytes, {
    type: "array",
    cellFormula: true,
    cellNF: true,
    cellText: true,
    cellDates: false,
    cellHTML: false,
    cellStyles: true,
    sheetStubs: true,
    bookVBA: false,
    WTF: true,
    xlfn: true,
  })
}
