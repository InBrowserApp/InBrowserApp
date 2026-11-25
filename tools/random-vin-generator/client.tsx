import { BatchTextGenerator } from "@workspace/ui/components/tool/batch-text-generator"

import { generateVins } from "./core/vins"

export type VinMessages = typeof import("./messages/en.json")

export default function RandomVinClient({
  messages,
}: Readonly<{ messages: VinMessages }>) {
  return (
    <BatchTextGenerator
      messages={messages}
      generateBatch={generateVins}
      downloadName="random-vins.txt"
    />
  )
}
