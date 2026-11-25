import { exportScore, type ScoreFormat } from "@workspace/score-export"
import {
  musicXmlBasename,
  renderMusicXmlPages,
} from "@workspace/score-export/musicxml"

export async function exportMusicXml(
  file: File,
  format: ScoreFormat,
  language: string
) {
  return exportScore(
    await renderMusicXmlPages(file),
    format,
    musicXmlBasename(file.name),
    language
  )
}
