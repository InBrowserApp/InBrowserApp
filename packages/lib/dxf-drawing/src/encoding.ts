const codePages: Record<string, string> = {
  "874": "windows-874",
  "932": "shift_jis",
  "936": "gbk",
  "949": "euc-kr",
  "950": "big5",
}

export function dxfEncoding(header: string) {
  if (header.startsWith("AutoCAD Binary DXF")) {
    throw new Error("Binary DXF", { cause: "binary" })
  }
  const version = header.match(/\$ACADVER\s+1\s+AC(\d{4})/i)?.[1]
  // R2007 and later store drawing text in UTF-8.
  if (version && Number(version) >= 1021) return "utf-8"
  const page = header.match(/\$DWGCODEPAGE\s+3\s+(?:ANSI_|DOS)(\d+)/i)?.[1]
  if (!page) return "utf-8"
  if (/^125[0-8]$/.test(page)) return `windows-${page}`
  return codePages[page] ?? "utf-8"
}
