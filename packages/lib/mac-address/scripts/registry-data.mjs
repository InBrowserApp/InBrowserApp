import { createHash } from "node:crypto"

const sources = [
  ["MA-L", "oui/oui.csv", 6, 1000],
  ["MA-M", "oui28/mam.csv", 7, 100],
  ["MA-S", "oui36/oui36.csv", 9, 100],
  ["IAB", "iab/iab.csv", 9, 100],
  ["CID", "cid/cid.csv", 6, 10],
].map(([registry, path, prefixLength, minimumRecords]) => ({
  registry,
  url: `https://standards-oui.ieee.org/${path}`,
  filename: path.split("/").at(-1),
  prefixLength,
  minimumRecords,
}))

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ""
  let quoted = false
  const input = text.replace(/^\uFEFF/, "")

  for (let index = 0; index < input.length; index++) {
    const character = input[index]
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"'
        index++
      } else {
        quoted = !quoted
      }
    } else if (!quoted && character === ",") {
      row.push(field)
      field = ""
    } else if (!quoted && (character === "\n" || character === "\r")) {
      row.push(field)
      if (row.some((value) => value !== "")) rows.push(row)
      row = []
      field = ""
      if (character === "\r" && input[index + 1] === "\n") index++
    } else {
      field += character
    }
  }

  if (quoted) throw new Error("Unterminated quoted CSV field")
  row.push(field)
  if (row.some((value) => value !== "")) rows.push(row)
  return rows
}

function parseRegistry(source, raw, minimumRecords = source.minimumRecords) {
  const [header, ...rows] = parseCsv(raw.toString("utf8"))
  const expectedHeader = [
    "Registry",
    "Assignment",
    "Organization Name",
    "Organization Address",
  ]
  if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
    throw new Error(`${source.registry}: unexpected CSV header`)
  }
  const records = rows.map((row) => {
    const [registry, assignment, organization, address] = row
    if (
      row.length !== 4 ||
      registry !== source.registry ||
      !new RegExp(`^[0-9A-F]{${source.prefixLength}}$`).test(assignment) ||
      !organization.trim()
    ) {
      throw new Error(`${source.registry}: invalid assignment row`)
    }
    return [registry, assignment, organization.trim(), address.trim()]
  })
  if (records.length < minimumRecords) {
    throw new Error(`${source.registry}: too few registry records`)
  }
  return records
}

function createSnapshot(downloads, retrievedAt) {
  if (Number.isNaN(Date.parse(retrievedAt))) {
    throw new Error("Invalid snapshot retrieval date")
  }
  const records = downloads.flatMap(({ source, raw }) =>
    parseRegistry(source, raw)
  )
  records.sort((left, right) => {
    for (const index of [1, 0, 2, 3]) {
      if (left[index] < right[index]) return -1
      if (left[index] > right[index]) return 1
    }
    return 0
  })
  const organizations = []
  const organizationIndexes = new Map()
  const seen = new Set()
  const prefixCounts = new Map()
  const assignments = records.map(([registry, assignment, name, address]) => {
    const assignmentKey = `${registry}:${assignment}`
    const recordKey = JSON.stringify([registry, assignment, name, address])
    if (seen.has(recordKey)) {
      throw new Error(`Duplicate registry record: ${assignmentKey}`)
    }
    seen.add(recordKey)
    prefixCounts.set(assignmentKey, (prefixCounts.get(assignmentKey) ?? 0) + 1)
    const organizationKey = JSON.stringify([name, address])
    let index = organizationIndexes.get(organizationKey)
    if (index === undefined) {
      index = organizations.length
      organizationIndexes.set(organizationKey, index)
      organizations.push([name, address])
    }
    return [registry, assignment, index]
  })

  return {
    snapshot: {
      schemaVersion: 1,
      updatedAt: retrievedAt,
      organizations,
      assignments,
    },
    metadata: {
      schemaVersion: 1,
      retrievedAt,
      totalRecords: records.length,
      totalOrganizations: new Set(records.map((record) => record[2])).size,
      duplicatePrefixCount: [...prefixCounts.values()].filter(
        (count) => count > 1
      ).length,
      sources: downloads.map(({ source, raw, lastModified, etag }) => ({
        registry: source.registry,
        url: source.url,
        sha256: createHash("sha256").update(raw).digest("hex"),
        records: records.filter((record) => record[0] === source.registry)
          .length,
        lastModified: lastModified ?? null,
        etag: etag ?? null,
      })),
    },
  }
}

export { sources, parseCsv, parseRegistry, createSnapshot }
