import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { BadgeCheck, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { JWT_ALGORITHMS, type AlgorithmSelection } from "../core/jwt-types"
import type { JwtDecoderVerifierMessages } from "../client/types"
import type { JwtVerificationResult } from "../core/jwt-types"

type VerificationCardProps = Readonly<{
  algorithm: AlgorithmSelection
  keyInput: string
  messages: JwtDecoderVerifierMessages
  result: JwtVerificationResult | null
  tokenIsDecoded: boolean
  verifying: boolean
  onAlgorithmChange: (algorithm: AlgorithmSelection) => void
  onKeyInputChange: (value: string) => void
}>

function VerificationCard({
  algorithm,
  keyInput,
  messages,
  result,
  tokenIsDecoded,
  verifying,
  onAlgorithmChange,
  onKeyInputChange,
}: VerificationCardProps) {
  const verificationMessages = messages.verification

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{verificationMessages.title}</CardTitle>
            <CardDescription>
              {verificationMessages.description}
            </CardDescription>
          </div>
          <Badge variant="secondary">{algorithm}</Badge>
        </div>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>{verificationMessages.algorithmLabel}</FieldLabel>
            <Select
              value={algorithm}
              onValueChange={(value) => {
                onAlgorithmChange(value as AlgorithmSelection)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="auto">
                    {verificationMessages.autoAlgorithm}
                  </SelectItem>
                  {JWT_ALGORITHMS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              {verificationMessages.algorithmDescription}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="jwt-verification-key">
              {verificationMessages.keyLabel}
            </FieldLabel>
            <Textarea
              id="jwt-verification-key"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              dir="ltr"
              name="jwt-verification-key"
              spellCheck={false}
              translate="no"
              value={keyInput}
              onChange={(event) => {
                onKeyInputChange(event.target.value)
              }}
              placeholder={verificationMessages.keyPlaceholder}
              className="[field-sizing:fixed] min-h-36 resize-y text-left font-mono text-sm"
            />
            <FieldDescription>
              {verificationMessages.keyDescription}
            </FieldDescription>
          </Field>
        </FieldGroup>

        <VerificationStatus
          keyInput={keyInput}
          messages={verificationMessages}
          result={result}
          tokenIsDecoded={tokenIsDecoded}
          verifyErrors={messages.verifyErrors}
          verifying={verifying}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function VerificationStatus({
  keyInput,
  messages,
  result,
  tokenIsDecoded,
  verifyErrors,
  verifying,
}: Readonly<{
  keyInput: string
  messages: JwtDecoderVerifierMessages["verification"]
  result: JwtVerificationResult | null
  tokenIsDecoded: boolean
  verifyErrors: JwtDecoderVerifierMessages["verifyErrors"]
  verifying: boolean
}>) {
  if (!tokenIsDecoded || keyInput.trim() === "") {
    return (
      <Empty className="min-h-32">
        <EmptyHeader>
          <EmptyTitle>{messages.waitingTitle}</EmptyTitle>
          <EmptyDescription>{messages.waitingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (verifying) {
    return (
      <Alert aria-live="polite">
        <LoaderCircle className="animate-spin" />
        <AlertTitle>{messages.pendingTitle}</AlertTitle>
      </Alert>
    )
  }

  if (result?.status === "verified") {
    return (
      <Alert aria-live="polite">
        <BadgeCheck />
        <AlertTitle>{messages.verifiedTitle}</AlertTitle>
        <AlertDescription>{messages.verifiedDescription}</AlertDescription>
      </Alert>
    )
  }

  if (result?.status === "failed") {
    return (
      <Alert variant="destructive" aria-live="polite">
        <TriangleAlert />
        <AlertTitle>{messages.failedTitle}</AlertTitle>
        <AlertDescription>{messages.failedDescription}</AlertDescription>
      </Alert>
    )
  }

  if (result?.status === "error") {
    return (
      <Alert variant="destructive" aria-live="polite">
        <TriangleAlert />
        <AlertTitle>{messages.failedTitle}</AlertTitle>
        <AlertDescription>{verifyErrors[result.code]}</AlertDescription>
      </Alert>
    )
  }

  return null
}

export { VerificationCard }
