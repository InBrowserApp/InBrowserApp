import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import {
  EC_CURVES,
  RSA_HASHES,
  RSA_KEY_SIZES,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
} from "../core/csr"
import type { CsrGeneratorMessages } from "../client/types"

type CsrKeySourceFieldsProps = Readonly<{
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
  keyPem: string
  messages: CsrGeneratorMessages
  onKeySourceChange: (value: KeySource) => void
  onAlgorithmChange: (value: KeyAlgorithm) => void
  onRsaKeySizeChange: (value: RsaKeySize) => void
  onRsaHashChange: (value: HashAlgorithm) => void
  onEcCurveChange: (value: EcCurve) => void
  onKeyPemChange: (value: string) => void
}>

function CsrKeySourceFields(props: CsrKeySourceFieldsProps) {
  const {
    keySource,
    algorithm,
    rsaKeySize,
    rsaHash,
    ecCurve,
    keyPem,
    messages,
    onKeySourceChange,
    onAlgorithmChange,
    onRsaKeySizeChange,
    onRsaHashChange,
    onEcCurveChange,
    onKeyPemChange,
  } = props

  const keySourceId = useId()
  const algorithmId = useId()
  const rsaKeySizeId = useId()
  const rsaHashId = useId()
  const ecCurveId = useId()
  const keyPemId = useId()

  return (
    <>
      <Field>
        <FieldLabel id={keySourceId}>{messages.keySourceLabel}</FieldLabel>
        <ToggleGroup
          type="single"
          value={keySource}
          aria-labelledby={keySourceId}
          variant="outline"
          className="grid w-full grid-cols-2"
          onValueChange={(value) => {
            if (value === "generate" || value === "import") {
              onKeySourceChange(value)
            }
          }}
        >
          <ToggleGroupItem value="generate" className="w-full">
            {messages.keySourceGenerate}
          </ToggleGroupItem>
          <ToggleGroupItem value="import" className="w-full">
            {messages.keySourceImport}
          </ToggleGroupItem>
        </ToggleGroup>
      </Field>

      {keySource === "generate" ? (
        <Field>
          <FieldLabel id={algorithmId}>{messages.algorithmLabel}</FieldLabel>
          <ToggleGroup
            type="single"
            value={algorithm}
            aria-labelledby={algorithmId}
            variant="outline"
            className="grid w-full grid-cols-2"
            onValueChange={(value) => {
              if (value === "rsa" || value === "ecdsa") {
                onAlgorithmChange(value)
              }
            }}
          >
            <ToggleGroupItem value="rsa" className="w-full">
              {messages.algorithmRsa}
            </ToggleGroupItem>
            <ToggleGroupItem value="ecdsa" className="w-full">
              {messages.algorithmEcdsa}
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
      ) : null}

      {keySource === "generate" && algorithm === "rsa" ? (
        <>
          <Field>
            <FieldLabel id={rsaKeySizeId}>
              {messages.rsaKeySizeLabel}
            </FieldLabel>
            <ToggleGroup
              type="single"
              value={String(rsaKeySize)}
              aria-labelledby={rsaKeySizeId}
              variant="outline"
              className="grid w-full grid-cols-3"
              onValueChange={(value) => {
                const next = Number(value) as RsaKeySize
                if (RSA_KEY_SIZES.includes(next)) {
                  onRsaKeySizeChange(next)
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
          </Field>
          <RsaHashField
            id={rsaHashId}
            value={rsaHash}
            label={messages.rsaHashLabel}
            onChange={onRsaHashChange}
          />
        </>
      ) : null}

      {keySource === "generate" && algorithm === "ecdsa" ? (
        <Field>
          <FieldLabel id={ecCurveId}>{messages.ecCurveLabel}</FieldLabel>
          <ToggleGroup
            type="single"
            value={ecCurve}
            aria-labelledby={ecCurveId}
            variant="outline"
            className="grid w-full grid-cols-3"
            onValueChange={(value) => {
              if (EC_CURVES.includes(value as EcCurve)) {
                onEcCurveChange(value as EcCurve)
              }
            }}
          >
            {EC_CURVES.map((curve) => (
              <ToggleGroupItem key={curve} value={curve} className="w-full">
                {curve}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
      ) : null}

      {keySource === "import" ? (
        <>
          <Field>
            <FieldLabel htmlFor={keyPemId}>{messages.importLabel}</FieldLabel>
            <Textarea
              id={keyPemId}
              name="private-key-pem"
              value={keyPem}
              placeholder={messages.importPlaceholder}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              rows={8}
              className="font-mono text-xs"
              onChange={(event) => onKeyPemChange(event.target.value)}
            />
            <FieldDescription>{messages.importDescription}</FieldDescription>
          </Field>
          <RsaHashField
            id={rsaHashId}
            value={rsaHash}
            label={messages.rsaHashLabel}
            onChange={onRsaHashChange}
          />
        </>
      ) : null}
    </>
  )
}

function RsaHashField({
  id,
  value,
  label,
  onChange,
}: Readonly<{
  id: string
  value: HashAlgorithm
  label: string
  onChange: (value: HashAlgorithm) => void
}>) {
  return (
    <Field>
      <FieldLabel id={id}>{label}</FieldLabel>
      <ToggleGroup
        type="single"
        value={value}
        aria-labelledby={id}
        variant="outline"
        className="grid w-full grid-cols-3"
        onValueChange={(next) => {
          if (RSA_HASHES.includes(next as HashAlgorithm)) {
            onChange(next as HashAlgorithm)
          }
        }}
      >
        {RSA_HASHES.map((hash) => (
          <ToggleGroupItem key={hash} value={hash} className="w-full">
            {hash}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  )
}

export { CsrKeySourceFields }
