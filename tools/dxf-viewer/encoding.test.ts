import { expect, it } from "vitest"
import { dxfEncoding } from "./encoding"

it("uses UTF-8 for R2007 and later, even with legacy code-page metadata", () => {
  expect(
    dxfEncoding("$ACADVER\r\n  1\r\nAC1021\r\n$DWGCODEPAGE\r\n  3\r\nANSI_1252")
  ).toBe("utf-8")
})

it("reads declared Western and Asian code pages for older drawings", () => {
  expect(dxfEncoding("$DWGCODEPAGE\n3\nANSI_1251")).toBe("windows-1251")
  expect(dxfEncoding("$DWGCODEPAGE\n3\nANSI_936")).toBe("gbk")
  expect(dxfEncoding("$DWGCODEPAGE\n3\nANSI_950")).toBe("big5")
})

it("handles absent or unsupported code-page metadata", () => {
  expect(dxfEncoding("0\nSECTION\n2\nENTITIES")).toBe("utf-8")
  expect(dxfEncoding("$DWGCODEPAGE\n3\nANSI_999")).toBe("utf-8")
})

it("identifies the binary header for a useful error", () => {
  expect(() => dxfEncoding("AutoCAD Binary DXF\r\n\x1a\0")).toThrow(
    "Binary DXF"
  )
})
