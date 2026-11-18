import { describe, expect, it } from "vitest"
import { convertReferences } from "./convert"
import { example, type Format } from "../formats"

const doi = "10.1234/example"
const longUrl = "https://example.org/" + "repository/".repeat(10) + "record"
const article = {
  id: "reference-1",
  type: "article-journal",
  title: "Measurements  - from the field",
  author: [{ family: "García", given: "Ana" }],
  issued: { "date-parts": [[2024]] },
  "container-title": "Methods Quarterly",
  page: "4-12",
  DOI: doi,
  URL: longUrl,
}
const ris = [
  "TY  - JOUR",
  "ID  - reference-1",
  "TI  - " + article.title,
  "AU  - García, Ana",
  "PY  - 2024",
  "JO  - Methods Quarterly",
  "SP  - 4",
  "EP  - 12",
  "DO  - " + doi,
  "UR  - " + longUrl,
  "ER  -",
].join("\r\n")
const bibtex = String.raw`% A common export header
@string{journalName = "Methods Quarterly"}
@article(reference-1,
  author = {Garc\'ia, Ana},
  title = {Measurements  - from the field},
  journal = journalName,
  year = 2024,
  pages = {4--12},
  doi = {${doi}},
  url = {${longUrl}}
)`

function converted(input: string, target: Format) {
  const result = convertReferences(input, "auto", target)
  expect(result.state).toBe("converted")
  if (result.state !== "converted") throw new Error(result.state)
  return result
}

describe("convertReferences", () => {
  it.each([
    [bibtex, "Measurements - from the field"],
    [ris, article.title],
  ])("maps publication metadata to CSL JSON", (input, title) => {
    const { output, count } = converted(input, "json")
    expect(count).toBe(1)
    expect(JSON.parse(output)).toEqual([
      expect.objectContaining({ ...article, title }),
    ])
  })

  it.each(["bibtex", "ris"] as const)(
    "serializes CSL JSON as %s and keeps the metadata when read again",
    (target) => {
      const { output } = converted(JSON.stringify(article), target)
      expect(output).toContain(longUrl)
      expect(JSON.parse(converted(output, "json").output)).toEqual([
        expect.objectContaining({
          ...article,
          title: expect.stringMatching(/^Measurements\s+- from the field$/),
        }),
      ])
    }
  )

  it("converts BibTeX directly to RIS and RIS directly to BibTeX", () => {
    expect(converted(bibtex, "ris").output).toContain("DO  - " + doi)
    expect(converted(ris, "bibtex").output).toContain("@article{reference-1,")
  })

  it("keeps original fields when checking the same format", () => {
    const extra = ris.replace("ER  -", "C1  - Custom field\r\nER  -")
    expect(converted(extra, "ris").output).toBe(extra)
  })

  it("creates distinct BibTeX keys while retaining each reference", () => {
    const input = JSON.stringify([
      { ...article, "citation-key": "article.2024" },
      { ...article, "citation-key": "article.2024" },
      { ...article, "citation-key": "invalid key" },
    ])
    const { output, count } = converted(input, "bibtex")
    expect(count).toBe(3)
    expect(output.match(/@article\{[^,]+/g)).toEqual([
      "@article{article.2024",
      "@article{article.2024-2",
      "@article{ref-3",
    ])
  })

  it("handles repeated RIS authors, legacy tags, continuation lines and blank values", () => {
    const source = [
      "",
      "TY  - JOURN",
      "",
      "T1  - Field notes",
      "continued here",
      "AU  - García, Ana",
      "continued name",
      "AU  - Silva, Luiz",
      "continued surname",
      "AU  - Smith, John",
      "N1  -",
      "ER  -",
    ].join("\r")
    expect(JSON.parse(converted(source, "json").output)).toEqual([
      expect.objectContaining({
        id: "ris-1",
        type: "article-journal",
        title: "Field notes continued here",
        author: [
          { family: "García", given: "Ana continued name" },
          { family: "Silva", given: "Luiz continued surname" },
          { family: "Smith", given: "John" },
        ],
      }),
    ])
  })

  it("maps unknown item types to generic RIS and CSL types", () => {
    expect(
      converted(JSON.stringify({ ...article, type: "unknown" }), "ris").output
    ).toContain("TY  - GEN")
    expect(
      JSON.parse(
        converted("TY  - UNKNOWN\nTI  - Field notes\nER  -", "json").output
      )
    ).toMatchObject([{ type: "document", title: "Field notes" }])
  })

  it("finds duplicates in the example and keeps all three entries", () => {
    expect(converted(example, "ris")).toMatchObject({
      count: 3,
      duplicates: [{ entries: [1, 2], reason: "metadata" }],
    })
  })

  it.each([
    ["", "auto"],
    ["{}", "json"],
    ["[]", "json"],
    ["null", "json"],
    ["[null]", "auto"],
    ['{"id":1,"type":""}', "auto"],
    ['{"type":"book"}', "auto"],
    ["@article{missing,", "bibtex"],
    ["ER  -", "ris"],
    ["TY  - BOOK\nTI  - Unclosed", "auto"],
    ["TY  - BOOK\nTY  - JOUR\nER  -", "auto"],
    ["TI  - Missing start", "ris"],
    [bibtex, "ris"],
  ] as const)("rejects incomplete or incorrect input", (input, source) => {
    expect(convertReferences(input, source, "bibtex")).toEqual({
      state: "inputError",
    })
  })

  it("reports a failure to format an input with an invalid field", () => {
    const input = JSON.stringify({ ...article, editor: "Invalid name list" })
    expect(convertReferences(input, "json", "bibtex")).toEqual({
      state: "outputError",
    })
  })
})
