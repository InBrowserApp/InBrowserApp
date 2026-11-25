import { AbcScoreConverter } from "@workspace/ui/components/tool/abc-score-converter/client"
import type english from "./messages/en.json"

export default function AbcNotationToMidi(props: {
  messages: typeof english
  language: string
}) {
  return <AbcScoreConverter mode="midi" {...props} />
}
