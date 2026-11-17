import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import test from "node:test"
import {
  createSnapshot,
  parseCsv,
  parseRegistry,
  sources,
} from "./registry-data.mjs"

const header = "Registry,Assignment,Organization Name,Organization Address\r\n"
const source = { ...sources[0], minimumRecords: 1 }
const retrievedAt = "2026-11-17T07:25:40.000Z"
const csv = (text) => Buffer.from(header + text)

test("parses quoted commas, doubled quotes, UTF-8 BOM and multiline fields", () => {
  assert.deepEqual(
    parseCsv('\uFEFFa,b\r\n"one,two","a ""quote""\nline"\r\n\r\n'),
    [
      ["a", "b"],
      ["one,two", 'a "quote"\nline'],
    ]
  )
  assert.deepEqual(parseCsv("a,b"), [["a", "b"]])
  assert.deepEqual(parseCsv("a,b\rc,d"), [
    ["a", "b"],
    ["c", "d"],
  ])
  assert.throws(() => parseCsv('"unterminated'), /Unterminated/)
})

test("validates IEEE headers, registries, prefix lengths and minimum sizes", () => {
  assert.deepEqual(parseRegistry(source, csv("MA-L,AABBCC, Acme , Street ")), [
    ["MA-L", "AABBCC", "Acme", "Street"],
  ])
  assert.throws(
    () => parseRegistry(source, Buffer.from("<html>Error</html>")),
    /unexpected CSV header/
  )
  for (const row of [
    "MA-M,AABBCC,Acme,Street",
    "MA-L,AABBCC0,Acme,Street",
    "MA-L,INVALID,Acme,Street",
    "MA-L,AABBCC, ,Street",
    "MA-L,AABBCC,Acme",
  ]) {
    assert.throws(
      () => parseRegistry(source, csv(row)),
      /invalid assignment row/
    )
  }
  assert.throws(
    () => parseRegistry(source, csv("")),
    /too few registry records/
  )
})

test("generates deterministic, sorted assignments with deduplicated organizations", () => {
  const raw = csv(
    "MA-L,AABBCC,Acme,Street\n" +
      "MA-L,001122,Acme,Street\n" +
      "MA-L,FFFFFF,Acme,Other Street"
  )
  const downloads = [{ source, raw }]
  const result = createSnapshot(downloads, retrievedAt)
  assert.deepEqual(result, createSnapshot(downloads, retrievedAt))
  assert.deepEqual(result.snapshot, {
    schemaVersion: 1,
    updatedAt: retrievedAt,
    organizations: [
      ["Acme", "Street"],
      ["Acme", "Other Street"],
    ],
    assignments: [
      ["MA-L", "001122", 0],
      ["MA-L", "AABBCC", 0],
      ["MA-L", "FFFFFF", 1],
    ],
  })
  assert.deepEqual(result.metadata, {
    schemaVersion: 1,
    retrievedAt,
    totalRecords: 3,
    totalOrganizations: 1,
    duplicatePrefixCount: 0,
    sources: [
      {
        registry: "MA-L",
        url: source.url,
        sha256: createHash("sha256").update(raw).digest("hex"),
        records: 3,
        lastModified: null,
        etag: null,
      },
    ],
  })
})

test("retains distinct child blocks and source HTTP metadata", () => {
  const narrowSource = { ...sources[1], minimumRecords: 1 }
  const result = createSnapshot(
    [
      {
        source: narrowSource,
        raw: csv("MA-M,AABBCC1,Child,Address"),
        lastModified: "Tue, 17 Nov 2026 07:00:00 GMT",
        etag: '"abc"',
      },
      { source, raw: csv("MA-L,AABBCC,Parent,Address") },
    ],
    retrievedAt
  )
  assert.equal(result.snapshot.assignments.length, 2)
  assert.equal(result.metadata.sources[0].etag, '"abc"')
  assert.equal(
    result.metadata.sources[0].lastModified,
    "Tue, 17 Nov 2026 07:00:00 GMT"
  )
})

test("preserves distinct assignees sharing a legacy prefix", () => {
  const result = createSnapshot(
    [
      {
        source,
        raw: csv("MA-L,080030,CERN,Address\nMA-L,080030,RMIT,Other Address"),
      },
    ],
    retrievedAt
  )
  assert.equal(result.snapshot.assignments.length, 2)
  assert.equal(result.metadata.duplicatePrefixCount, 1)
})

test("rejects duplicate complete records and an invalid retrieval date", () => {
  const downloads = [
    {
      source,
      raw: csv("MA-L,AABBCC,First,Address\nMA-L,AABBCC,First,Address"),
    },
  ]
  assert.throws(() => createSnapshot(downloads, retrievedAt), /Duplicate/)
  assert.throws(() => createSnapshot(downloads, "invalid"), /Invalid snapshot/)
})
