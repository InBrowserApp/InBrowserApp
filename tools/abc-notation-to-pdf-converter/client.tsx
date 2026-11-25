import { AbcScoreConverter } from "@workspace/ui/components/tool/abc-score-converter/client"
import type english from "./messages/en.json"

export default function AbcNotationToPdf(props: {
  messages: typeof english
  language: string
}) {
  return <AbcScoreConverter mode="pdf" {...props} />
}
