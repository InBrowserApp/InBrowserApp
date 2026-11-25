import { BatchTextGenerator } from "@workspace/ui/components/tool/batch-text-generator"

import { generateUpcs } from "./core/upcs"

export type UpcMessages = typeof import("./messages/en.json")

export default function RandomUpcClient({
  messages,
}: Readonly<{ messages: UpcMessages }>) {
  return (
    <BatchTextGenerator
      messages={messages}
      generateBatch={generateUpcs}
      downloadName="random-upcs.txt"
    />
  )
}
