import { describe, expect, test } from "vitest"

import {
  isValidNumeric,
  isValidSymbolic,
  numericToPermissions,
  numericToSymbolic,
  permissionsToNumeric,
  symbolicToNumeric,
} from "./chmod"

describe("numericToSymbolic", () => {
  test("converts common permission values", () => {
    expect(numericToSymbolic("755")).toBe("rwxr-xr-x")
    expect(numericToSymbolic("644")).toBe("rw-r--r--")
    expect(numericToSymbolic("777")).toBe("rwxrwxrwx")
    expect(numericToSymbolic("700")).toBe("rwx------")
    expect(numericToSymbolic("600")).toBe("rw-------")
    expect(numericToSymbolic("400")).toBe("r--------")
  })

  test("converts edge cases", () => {
    expect(numericToSymbolic("000")).toBe("---------")
    expect(numericToSymbolic("111")).toBe("--x--x--x")
    expect(numericToSymbolic("222")).toBe("-w--w--w-")
    expect(numericToSymbolic("444")).toBe("r--r--r--")
  })

  test("handles short input by padding", () => {
    expect(numericToSymbolic("55")).toBe("---r-xr-x")
    expect(numericToSymbolic("5")).toBe("------r-x")
  })

  test("returns an empty string for invalid input", () => {
    expect(numericToSymbolic("")).toBe("")
    expect(numericToSymbolic("888")).toBe("")
    expect(numericToSymbolic("abc")).toBe("")
    expect(numericToSymbolic("7755")).toBe("")
  })
})

describe("symbolicToNumeric", () => {
  test("converts common permission values", () => {
    expect(symbolicToNumeric("rwxr-xr-x")).toBe("755")
    expect(symbolicToNumeric("rw-r--r--")).toBe("644")
    expect(symbolicToNumeric("rwxrwxrwx")).toBe("777")
    expect(symbolicToNumeric("rwx------")).toBe("700")
    expect(symbolicToNumeric("rw-------")).toBe("600")
    expect(symbolicToNumeric("r--------")).toBe("400")
  })

  test("converts edge cases", () => {
    expect(symbolicToNumeric("---------")).toBe("000")
    expect(symbolicToNumeric("--x--x--x")).toBe("111")
    expect(symbolicToNumeric("-w--w--w-")).toBe("222")
    expect(symbolicToNumeric("r--r--r--")).toBe("444")
  })

  test("returns an empty string for invalid input", () => {
    expect(symbolicToNumeric("")).toBe("")
    expect(symbolicToNumeric("rwx")).toBe("")
    expect(symbolicToNumeric("rwxr-x")).toBe("")
    expect(symbolicToNumeric("abc123def")).toBe("")
    expect(symbolicToNumeric("rwxr-xr-xr")).toBe("")
  })
})

describe("isValidNumeric", () => {
  test("returns true for valid numeric permissions", () => {
    expect(isValidNumeric("755")).toBe(true)
    expect(isValidNumeric("644")).toBe(true)
    expect(isValidNumeric("777")).toBe(true)
    expect(isValidNumeric("000")).toBe(true)
    expect(isValidNumeric("0")).toBe(true)
    expect(isValidNumeric("77")).toBe(true)
    expect(isValidNumeric("  755  ")).toBe(true)
  })

  test("returns false for invalid numeric permissions", () => {
    expect(isValidNumeric("")).toBe(false)
    expect(isValidNumeric("888")).toBe(false)
    expect(isValidNumeric("7755")).toBe(false)
    expect(isValidNumeric("abc")).toBe(false)
    expect(isValidNumeric("7a5")).toBe(false)
  })
})

describe("isValidSymbolic", () => {
  test("returns true for valid symbolic permissions", () => {
    expect(isValidSymbolic("rwxr-xr-x")).toBe(true)
    expect(isValidSymbolic("rw-r--r--")).toBe(true)
    expect(isValidSymbolic("rwxrwxrwx")).toBe(true)
    expect(isValidSymbolic("---------")).toBe(true)
  })

  test("returns false for invalid symbolic permissions", () => {
    expect(isValidSymbolic("")).toBe(false)
    expect(isValidSymbolic("rwx")).toBe(false)
    expect(isValidSymbolic("rwxrwxrwxr")).toBe(false)
    expect(isValidSymbolic("abcdefghi")).toBe(false)
    expect(isValidSymbolic("rwxr-xr-a")).toBe(false)
  })
})

describe("permissionsToNumeric", () => {
  test("converts full permissions", () => {
    expect(
      permissionsToNumeric({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: true, execute: true },
        others: { read: true, write: true, execute: true },
      })
    ).toBe("777")
  })

  test("converts no permissions", () => {
    expect(
      permissionsToNumeric({
        owner: { read: false, write: false, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
      })
    ).toBe("000")
  })

  test("converts common permission patterns", () => {
    expect(
      permissionsToNumeric({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
      })
    ).toBe("755")

    expect(
      permissionsToNumeric({
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        others: { read: true, write: false, execute: false },
      })
    ).toBe("644")
  })
})

describe("numericToPermissions", () => {
  test("converts 777 to all permissions", () => {
    const permissions = numericToPermissions("777")

    expect(permissions.owner).toEqual({
      read: true,
      write: true,
      execute: true,
    })
    expect(permissions.group).toEqual({
      read: true,
      write: true,
      execute: true,
    })
    expect(permissions.others).toEqual({
      read: true,
      write: true,
      execute: true,
    })
  })

  test("converts 000 to no permissions", () => {
    const permissions = numericToPermissions("000")

    expect(permissions.owner).toEqual({
      read: false,
      write: false,
      execute: false,
    })
    expect(permissions.group).toEqual({
      read: false,
      write: false,
      execute: false,
    })
    expect(permissions.others).toEqual({
      read: false,
      write: false,
      execute: false,
    })
  })

  test("returns empty permissions for invalid input", () => {
    expect(numericToPermissions("abc")).toEqual({
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      others: { read: false, write: false, execute: false },
    })
  })
})

describe("round-trip conversions", () => {
  test("preserve common numeric values", () => {
    for (const numeric of [
      "755",
      "644",
      "777",
      "700",
      "600",
      "400",
      "000",
      "111",
      "222",
      "444",
    ]) {
      expect(symbolicToNumeric(numericToSymbolic(numeric))).toBe(numeric)
    }
  })

  test("preserve common symbolic values", () => {
    for (const symbolic of [
      "rwxr-xr-x",
      "rw-r--r--",
      "rwxrwxrwx",
      "rwx------",
      "rw-------",
      "r--------",
      "---------",
    ]) {
      expect(numericToSymbolic(symbolicToNumeric(symbolic))).toBe(symbolic)
    }
  })
})
