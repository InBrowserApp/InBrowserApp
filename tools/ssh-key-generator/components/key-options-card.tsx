import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import { RSA_KEY_SIZES } from "../core/ssh-keygen"
import type { RsaKeySize, SshKeyAlgorithm } from "../core/ssh-keygen"
import type { SshKeyGeneratorMessages } from "../client/types"

type KeyOptionsCardProps = Readonly<{
  algorithm: SshKeyAlgorithm
  algorithmId: string
  comment: string
  commentId: string
  generating: boolean
  messages: SshKeyGeneratorMessages
  onAlgorithmChange: (algorithm: SshKeyAlgorithm) => void
  onCommentChange: (comment: string) => void
  onReset: () => void
  onRsaKeySizeChange: (size: RsaKeySize) => void
  rsaKeySize: RsaKeySize
  rsaSizeId: string
}>

function KeyOptionsCard({
  algorithm,
  algorithmId,
  comment,
  commentId,
  generating,
  messages,
  onAlgorithmChange,
  onCommentChange,
  onReset,
  onRsaKeySizeChange,
  rsaKeySize,
  rsaSizeId,
}: KeyOptionsCardProps) {
  return (
    <ToolPanelCard className="xl:sticky xl:top-6 xl:h-auto xl:self-start">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel id={algorithmId}>{messages.algorithmLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={algorithm}
              aria-labelledby={algorithmId}
              variant="outline"
              className="grid w-full grid-cols-2"
              onValueChange={(value) => {
                if (value === "ed25519" || value === "rsa") {
                  onAlgorithmChange(value)
                }
              }}
            >
              <ToggleGroupItem value="ed25519" className="w-full">
                {messages.algorithmEd25519}
              </ToggleGroupItem>
              <ToggleGroupItem value="rsa" className="w-full">
                {messages.algorithmRsa}
              </ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>{messages.algorithmDescription}</FieldDescription>
          </Field>

          {algorithm === "rsa" ? (
            <Field>
              <FieldLabel id={rsaSizeId}>{messages.rsaSizeLabel}</FieldLabel>
              <ToggleGroup
                type="single"
                value={String(rsaKeySize)}
                aria-labelledby={rsaSizeId}
                variant="outline"
                className="grid w-full grid-cols-3"
                onValueChange={(value) => {
                  const nextSize = Number(value)

                  if (RSA_KEY_SIZES.includes(nextSize as RsaKeySize)) {
                    onRsaKeySizeChange(nextSize as RsaKeySize)
                  }
                }}
              >
                {RSA_KEY_SIZES.map((size) => (
                  <ToggleGroupItem
                    key={size}
                    value={String(size)}
                    className="w-full"
                  >
                    {size}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldDescription>{messages.rsaSizeDescription}</FieldDescription>
            </Field>
          ) : null}

          <Field>
            <FieldLabel htmlFor={commentId}>{messages.commentLabel}</FieldLabel>
            <Input
              id={commentId}
              name="comment"
              value={comment}
              placeholder={messages.commentPlaceholder}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                onCommentChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.commentDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button type="submit" size="sm" disabled={generating}>
          {generating ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {generating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { KeyOptionsCard }
