import {
  buildDohUrl,
  DOH_SERVERS,
  normalizeDnsName,
  queryDoh,
  type DnsJsonAnswer,
  type DnsJsonResponse,
  type DnsQueryOptions,
  type FetchLike,
} from "@workspace/dns"

import {
  DNS_RECORD_TYPE_OPTIONS,
  DNS_RECORD_TYPES,
  getRecordTypeName,
  type DnsRecordType,
} from "./record-types"

type DnsLookupResult = Readonly<{
  recordType: DnsRecordType
  response: DnsJsonResponse
}>

const DEFAULT_RECORD_TYPES = [
  "A",
  "AAAA",
] as const satisfies readonly DnsRecordType[]

const DNS_RESPONSE_CODES: Record<
  number,
  Readonly<{ name: string; description: string }>
> = {
  0: { name: "NoError", description: "No error" },
  1: { name: "FormErr", description: "Format error" },
  2: { name: "ServFail", description: "Server failure" },
  3: { name: "NXDomain", description: "Non-existent domain" },
  4: { name: "NotImp", description: "Not implemented" },
  5: { name: "Refused", description: "Query refused" },
  6: { name: "YXDomain", description: "Name exists when it should not" },
  7: { name: "YXRRSet", description: "RR set exists when it should not" },
  8: { name: "NXRRSet", description: "RR set does not exist" },
  9: { name: "NotAuth", description: "Server not authoritative" },
  10: { name: "NotZone", description: "Name not contained in zone" },
  16: { name: "BADVERS", description: "Bad OPT version" },
  17: { name: "BADKEY", description: "Key not recognized" },
  18: { name: "BADTIME", description: "Signature out of time window" },
  19: { name: "BADMODE", description: "Bad TKEY mode" },
  20: { name: "BADNAME", description: "Duplicate key name" },
  21: { name: "BADALG", description: "Algorithm not supported" },
  22: { name: "BADTRUNC", description: "Bad truncation" },
  23: { name: "BADCOOKIE", description: "Bad or missing server cookie" },
} as const

function getResponseCode(status: number) {
  return (
    DNS_RESPONSE_CODES[status] ?? {
      name: `RCODE ${status}`,
      description: "Unknown DNS response code",
    }
  )
}

async function lookupDnsRecords(
  serverUrl: string,
  name: string,
  recordTypes: readonly DnsRecordType[],
  options: DnsQueryOptions = {},
  fetcher: FetchLike = fetch
): Promise<readonly DnsLookupResult[]> {
  const normalizedName = normalizeDnsName(name)

  if (recordTypes.length === 0) {
    throw new Error("Select at least one record type.")
  }

  const uniqueRecordTypes = DNS_RECORD_TYPES.filter((recordType) =>
    recordTypes.includes(recordType)
  )

  if (uniqueRecordTypes.length === 0) {
    throw new Error("Select at least one supported record type.")
  }

  return Promise.all(
    uniqueRecordTypes.map(async (recordType) => ({
      recordType,
      response: await queryDoh(
        serverUrl,
        normalizedName,
        recordType,
        options,
        fetcher
      ),
    }))
  )
}

export {
  DEFAULT_RECORD_TYPES,
  DNS_RECORD_TYPE_OPTIONS,
  DNS_RECORD_TYPES,
  DOH_SERVERS,
  buildDohUrl,
  getRecordTypeName,
  getResponseCode,
  lookupDnsRecords,
  normalizeDnsName,
  queryDoh,
}
export type {
  DnsJsonAnswer,
  DnsJsonResponse,
  DnsLookupResult,
  DnsRecordType,
  FetchLike,
}
