import { describe, expect, test } from "vitest"

import {
  buildCssSnippet,
  buildFontFaceDescriptor,
  filterAndSortFonts,
  groupFonts,
  inferFontWeight,
  isItalicStyle,
  normalizeFonts,
  resolveFontLoadError,
} from "./local-font-book"

describe("normalizeFonts", () => {
  test("normalizes font metadata and derives display values", () => {
    expect(
      normalizeFonts([
        {
          family: "Inter",
          fullName: "Inter Regular",
          postscriptName: "Inter-Regular",
          style: "Regular",
        },
      ])
    ).toEqual([
      {
        id: "Inter-Regular",
        family: "Inter",
        fullName: "Inter Regular",
        postscriptName: "Inter-Regular",
        style: "Regular",
        displayFamily: "Inter",
        displayName: "Inter Regular",
        displayStyle: "Regular",
        searchKey: "inter inter regular inter-regular",
      },
    ])
  })

  test("falls back when metadata is missing", () => {
    expect(
      normalizeFonts([
        {
          family: "",
          fullName: "",
          postscriptName: "",
          style: "",
        },
      ])
    ).toEqual([
      {
        id: "font-0",
        family: "",
        fullName: "",
        postscriptName: "",
        style: "",
        displayFamily: "--",
        displayName: "--",
        displayStyle: "--",
        searchKey: "-- -- ",
      },
    ])
  })
})

describe("filterAndSortFonts", () => {
  const fonts = normalizeFonts([
    {
      family: "Inter",
      fullName: "Inter Regular",
      postscriptName: "Inter-Regular",
      style: "Regular",
    },
    {
      family: "Inter",
      fullName: "Inter Italic",
      postscriptName: "Inter-Italic",
      style: "Italic",
    },
    {
      family: "Roboto",
      fullName: "Roboto Bold",
      postscriptName: "Roboto-Bold",
      style: "Bold",
    },
  ])

  test("filters by query and italic style", () => {
    expect(
      filterAndSortFonts(fonts, {
        query: "inter",
        filterStyle: "italic",
        sortBy: "family",
      }).map((font) => font.id)
    ).toEqual(["Inter-Italic"])
  })

  test("sorts by the requested field", () => {
    expect(
      filterAndSortFonts(fonts, {
        query: "",
        filterStyle: "all",
        sortBy: "name",
      }).map((font) => font.displayName)
    ).toEqual(["Inter Italic", "Inter Regular", "Roboto Bold"])
  })
})

describe("groupFonts", () => {
  const fonts = normalizeFonts([
    {
      family: "Inter",
      fullName: "Inter Regular",
      postscriptName: "Inter-Regular",
      style: "Regular",
    },
    {
      family: "Inter",
      fullName: "Inter Italic",
      postscriptName: "Inter-Italic",
      style: "Italic",
    },
  ])

  test("groups by family", () => {
    expect(groupFonts(fonts, true)).toEqual([
      {
        id: "Inter",
        label: "Inter",
        items: fonts,
      },
    ])
  })

  test("returns a flat group when grouping is disabled", () => {
    expect(groupFonts(fonts, false)).toEqual([
      {
        id: "all-fonts",
        label: "",
        items: fonts,
      },
    ])
  })

  test("returns an empty list when there are no fonts", () => {
    expect(groupFonts([], false)).toEqual([])
  })
})

describe("buildFontFaceDescriptor", () => {
  const font = normalizeFonts([
    {
      family: 'A "Quoted" Family',
      fullName: "A Quoted Family Bold Italic",
      postscriptName: "Quoted-BoldItalic",
      style: "Bold Italic",
    },
  ])[0]

  test("returns a quoted descriptor for preview styles", () => {
    expect(buildFontFaceDescriptor(font)).toEqual({
      fontFamily: '"A \\"Quoted\\" Family"',
      fontStyle: "italic",
      fontWeight: 700,
    })
  })

  test("returns null when no family data is available", () => {
    expect(
      buildFontFaceDescriptor(
        normalizeFonts([{ family: "", fullName: "", postscriptName: "" }])[0]
      )
    ).toBeNull()
  })
})

describe("buildCssSnippet", () => {
  test("builds a CSS snippet for italic weighted fonts", () => {
    const font = normalizeFonts([
      {
        family: "Inter",
        fullName: "Inter SemiBold Italic",
        postscriptName: "Inter-SemiBoldItalic",
        style: "SemiBold Italic",
      },
    ])[0]

    expect(buildCssSnippet(font)).toBe(
      'font-family: "Inter";\nfont-style: italic;\nfont-weight: 600;'
    )
  })

  test("returns an empty snippet when no usable family exists", () => {
    expect(
      buildCssSnippet(
        normalizeFonts([{ family: "", fullName: "", postscriptName: "" }])[0]
      )
    ).toBe("")
  })
})

describe("style helpers", () => {
  test("detects italic styles", () => {
    expect(isItalicStyle("Oblique")).toBe(true)
    expect(isItalicStyle("Regular")).toBe(false)
  })

  test("infers numeric and keyword weights", () => {
    expect(inferFontWeight("300 Italic")).toBe(300)
    expect(inferFontWeight("ExtraBold")).toBe(800)
    expect(inferFontWeight("")).toBeUndefined()
  })
})

describe("resolveFontLoadError", () => {
  test("maps known browser errors", () => {
    expect(resolveFontLoadError({ name: "NotAllowedError" })).toBe(
      "not-allowed"
    )
    expect(resolveFontLoadError({ name: "SecurityError" })).toBe("security")
  })

  test("falls back to unknown for unexpected errors", () => {
    expect(resolveFontLoadError({ name: "SomethingElse" })).toBe("unknown")
    expect(resolveFontLoadError(null)).toBe("unknown")
  })
})
