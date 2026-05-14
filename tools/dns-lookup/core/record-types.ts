const DNS_RECORD_TYPE_OPTIONS = [
  { code: 1, type: "A" },
  { code: 2, type: "NS" },
  { code: 5, type: "CNAME" },
  { code: 6, type: "SOA" },
  { code: 12, type: "PTR" },
  { code: 13, type: "HINFO" },
  { code: 15, type: "MX" },
  { code: 16, type: "TXT" },
  { code: 17, type: "RP" },
  { code: 18, type: "AFSDB" },
  { code: 24, type: "SIG" },
  { code: 25, type: "KEY" },
  { code: 28, type: "AAAA" },
  { code: 29, type: "LOC" },
  { code: 33, type: "SRV" },
  { code: 35, type: "NAPTR" },
  { code: 36, type: "KX" },
  { code: 37, type: "CERT" },
  { code: 39, type: "DNAME" },
  { code: 42, type: "APL" },
  { code: 43, type: "DS" },
  { code: 44, type: "SSHFP" },
  { code: 45, type: "IPSECKEY" },
  { code: 46, type: "RRSIG" },
  { code: 47, type: "NSEC" },
  { code: 48, type: "DNSKEY" },
  { code: 49, type: "DHCID" },
  { code: 50, type: "NSEC3" },
  { code: 51, type: "NSEC3PARAM" },
  { code: 52, type: "TLSA" },
  { code: 53, type: "SMIMEA" },
  { code: 55, type: "HIP" },
  { code: 59, type: "CDS" },
  { code: 60, type: "CDNSKEY" },
  { code: 61, type: "OPENPGPKEY" },
  { code: 62, type: "CSYNC" },
  { code: 63, type: "ZONEMD" },
  { code: 64, type: "SVCB" },
  { code: 65, type: "HTTPS" },
  { code: 108, type: "EUI48" },
  { code: 109, type: "EUI64" },
  { code: 249, type: "TKEY" },
  { code: 250, type: "TSIG" },
  { code: 255, type: "ANY" },
  { code: 256, type: "URI" },
  { code: 257, type: "CAA" },
  { code: 32768, type: "TA" },
  { code: 32769, type: "DLV" },
] as const

type DnsRecordType = (typeof DNS_RECORD_TYPE_OPTIONS)[number]["type"]

const DNS_RECORD_TYPES = DNS_RECORD_TYPE_OPTIONS.map(
  (option) => option.type
) as readonly DnsRecordType[]
const DNS_RECORD_TYPE_NAMES = new Map<number, string>(
  DNS_RECORD_TYPE_OPTIONS.map((option) => [option.code, option.type])
)

function getRecordTypeName(type: number) {
  return DNS_RECORD_TYPE_NAMES.get(type) ?? String(type)
}

export { DNS_RECORD_TYPE_OPTIONS, DNS_RECORD_TYPES, getRecordTypeName }
export type { DnsRecordType }
