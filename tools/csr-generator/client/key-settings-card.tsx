import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
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
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Lock } from "@workspace/ui/icons"

import { EC_CURVES, RSA_HASH_ALGORITHMS, RSA_KEY_SIZES } from "../core/types"
import { ToggleField } from "./toggle-field"
import type {
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
} from "../core/csr"
import type { CsrGeneratorMessages } from "./types"

type KeySettingsCardProps = Readonly<{
  algorithm: KeyAlgorithm
  ecCurve: EcCurve
  ids: {
    privateKey: string
    privateKeyFile: string
  }
  keySource: KeySource
  messages: CsrGeneratorMessages
  privateKeyText: string
  rsaHash: HashAlgorithm
  rsaKeySize: RsaKeySize
  onAlgorithmChange: (value: KeyAlgorithm) => void
  onEcCurveChange: (value: EcCurve) => void
  onKeySourceChange: (value: KeySource) => void
  onPrivateKeyFileChange: (file: File | null) => void
  onPrivateKeyTextChange: (value: string) => void
  onRsaHashChange: (value: HashAlgorithm) => void
  onRsaKeySizeChange: (value: RsaKeySize) => void
}>

function KeySettingsCard({
  algorithm,
  ecCurve,
  ids,
  keySource,
  messages,
  privateKeyText,
  rsaHash,
  rsaKeySize,
  onAlgorithmChange,
  onEcCurveChange,
  onKeySourceChange,
  onPrivateKeyFileChange,
  onPrivateKeyTextChange,
  onRsaHashChange,
  onRsaKeySizeChange,
}: KeySettingsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.keySettingsTitle}</CardTitle>
        <CardDescription>{messages.keySettingsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldTitle>{messages.keySourceLabel}</FieldTitle>
            <ToggleField
              ariaLabel={messages.keySourceLabel}
              value={keySource}
              options={[
                { value: "generate", label: messages.generateKeyLabel },
                { value: "import", label: messages.importKeyLabel },
              ]}
              onValueChange={onKeySourceChange}
            />
          </Field>

          {keySource === "generate" ? (
            <Field>
              <FieldTitle>{messages.algorithmLabel}</FieldTitle>
              <ToggleField
                ariaLabel={messages.algorithmLabel}
                value={algorithm}
                options={[
                  { value: "rsa", label: messages.rsaLabel },
                  { value: "ecdsa", label: messages.ecdsaLabel },
                ]}
                onValueChange={onAlgorithmChange}
              />
            </Field>
          ) : null}

          {keySource === "generate" && algorithm === "rsa" ? (
            <Field>
              <FieldTitle>{messages.rsaKeySizeLabel}</FieldTitle>
              <ToggleField
                ariaLabel={messages.rsaKeySizeLabel}
                value={String(rsaKeySize)}
                options={RSA_KEY_SIZES.map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                onValueChange={(value) => {
                  onRsaKeySizeChange(Number(value) as RsaKeySize)
                }}
              />
            </Field>
          ) : null}

          <Field>
            <FieldLabel>{messages.rsaHashLabel}</FieldLabel>
            <Select
              value={rsaHash}
              onValueChange={(value) => {
                onRsaHashChange(value as HashAlgorithm)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {RSA_HASH_ALGORITHMS.map((hash) => (
                    <SelectItem key={hash} value={hash}>
                      {hash}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {keySource === "generate" && algorithm === "ecdsa" ? (
            <Field>
              <FieldLabel>{messages.ecCurveLabel}</FieldLabel>
              <Select
                value={ecCurve}
                onValueChange={(value) => {
                  onEcCurveChange(value as EcCurve)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {EC_CURVES.map((curve) => (
                      <SelectItem key={curve} value={curve}>
                        {curve}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ) : null}

          {keySource === "import" ? (
            <Field>
              <FieldLabel htmlFor={ids.privateKey}>
                {messages.privateKeyLabel}
              </FieldLabel>
              <Textarea
                id={ids.privateKey}
                value={privateKeyText}
                className="min-h-40 resize-y font-mono text-xs"
                placeholder={messages.privateKeyPlaceholder}
                spellCheck={false}
                onChange={(event) => {
                  onPrivateKeyTextChange(event.target.value)
                }}
              />
              <FieldDescription>
                {messages.privateKeyDescription}
              </FieldDescription>
              <FieldLabel htmlFor={ids.privateKeyFile}>
                {messages.privateKeyFileLabel}
              </FieldLabel>
              <Input
                id={ids.privateKeyFile}
                type="file"
                accept=".pem,.key,.txt"
                onChange={(event) => {
                  onPrivateKeyFileChange(event.target.files?.[0] ?? null)
                }}
              />
              <FieldDescription>{messages.privateKeyFileHint}</FieldDescription>
            </Field>
          ) : null}
        </FieldGroup>

        <Alert role="note">
          <Lock aria-hidden="true" />
          <AlertTitle>{messages.privacyNoteTitle}</AlertTitle>
          <AlertDescription>{messages.privacyNoteDescription}</AlertDescription>
        </Alert>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { KeySettingsCard }
