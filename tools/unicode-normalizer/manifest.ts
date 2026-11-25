import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "text",
  icon: "case-sensitive",
  tags: [
    "unicode",
    "normalization",
    "nfc",
    "nfd",
    "nfkc",
    "nfkd",
    "code-points",
    "combining-marks",
    "full-width",
  ],
})
