import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { HashTextOrFileTemplatePageMessages } from "../client/types"
import {
  HASH_ALGORITHMS,
  isHashAlgorithm,
  type HashAlgorithm,
} from "../core/hash"

type AlgorithmCardProps = Readonly<{
  algorithm: HashAlgorithm
  messages: HashTextOrFileTemplatePageMessages
  onAlgorithmChange: (algorithm: HashAlgorithm) => void
}>

function AlgorithmCard({
  algorithm,
  messages,
  onAlgorithmChange,
}: AlgorithmCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.algorithmLabel}</CardTitle>
        <CardDescription>{messages.algorithmDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={algorithm}
          variant="outline"
          spacing={8}
          aria-label={messages.algorithmLabel}
          className="w-full flex-wrap items-stretch justify-start"
          onValueChange={(value) => {
            if (isHashAlgorithm(value)) {
              onAlgorithmChange(value)
            }
          }}
        >
          {HASH_ALGORITHMS.map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              className="min-w-28 flex-1"
            >
              {messages.algorithmLabels[option]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
    </Card>
  )
}

export { AlgorithmCard }
