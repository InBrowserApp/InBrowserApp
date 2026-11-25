import { exportScore, type ScoreFormat } from "@workspace/score-export"
import { readAbcTunes, renderAbcPages } from "@workspace/score-export/abc"

export async function exportAbc(
  source: string,
  format: ScoreFormat,
  name: string,
  language: string
) {
  const pages = await renderAbcPages(readAbcTunes(source))
  return exportScore(pages, format, name, language)
}
