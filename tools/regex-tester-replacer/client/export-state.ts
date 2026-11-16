import {
  formatMatchesForExport,
  type RegexMatch,
  type RegexResultView,
} from "../core/regex-tester-replacer"

import type { RegexExportState } from "../types"

function getExportState(
  activeView: RegexResultView,
  replacementOutput: string,
  matches: readonly RegexMatch[],
  isBlocked: boolean
): Omit<RegexExportState, "downloadUrl"> {
  if (isBlocked) {
    return {
      downloadName: "result.txt",
      value: "",
    }
  }

  if (activeView === "matches") {
    return {
      downloadName: "regex-matches.tsv",
      value: formatMatchesForExport(matches),
    }
  }

  if (activeView === "replace") {
    return {
      downloadName: "replaced-text.txt",
      value: replacementOutput,
    }
  }

  return {
    downloadName: "result.txt",
    value: "",
  }
}

export { getExportState }
