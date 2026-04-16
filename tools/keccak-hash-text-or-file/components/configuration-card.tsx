import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"

import type { KeccakHashTextOrFilePageMessages } from "../client/types"
import { KECCAK_OUTPUT_LENGTHS, type KeccakOutputLength } from "../core/keccak"

type ConfigurationCardProps = Readonly<{
  messages: KeccakHashTextOrFilePageMessages
  outputLength: KeccakOutputLength
  onOutputLengthChange: (value: KeccakOutputLength) => void
}>

function ConfigurationCard({
  messages,
  outputLength,
  onOutputLengthChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputLengthLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel>{messages.outputLengthLabel}</FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {outputLength}
            </span>
          </div>

          <div
            role="group"
            aria-label={messages.outputLengthLabel}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {KECCAK_OUTPUT_LENGTHS.map((value) => (
              <Button
                key={value}
                type="button"
                variant={value === outputLength ? "default" : "outline"}
                className="font-mono"
                onClick={() => {
                  onOutputLengthChange(value)
                }}
              >
                {value}
              </Button>
            ))}
          </div>
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
