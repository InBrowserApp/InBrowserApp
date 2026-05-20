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
    <div className="grid gap-3 sm:grid-cols-2">
      <KeySourceField
        id={keySourceId}
        label={messages.keySourceLabel}
        value={keySource}
        generateLabel={messages.keySourceGenerate}
        importLabel={messages.keySourceImport}
        onChange={onKeySourceChange}
      />

      {keySource === "generate" ? (
        <AlgorithmField
          id={algorithmId}
          label={messages.algorithmLabel}
          value={algorithm}
          rsaLabel={messages.algorithmRsa}
          ecdsaLabel={messages.algorithmEcdsa}
          onChange={onAlgorithmChange}
        />
      ) : (
        <RsaHashField
          id={rsaHashId}
          label={messages.rsaHashLabel}
          value={rsaHash}
          onChange={onRsaHashChange}
        />
      )}

      {keySource === "generate" && algorithm === "rsa" ? (
        <>
          <RsaKeySizeField
            id={rsaKeySizeId}
            label={messages.rsaKeySizeLabel}
            value={rsaKeySize}
            onChange={onRsaKeySizeChange}
          />
          <RsaHashField
            id={rsaHashId}
            label={messages.rsaHashLabel}
            value={rsaHash}
            onChange={onRsaHashChange}
          />
        </>
      ) : null}

      {keySource === "generate" && algorithm === "ecdsa" ? (
        <EcCurveField
          id={ecCurveId}
          label={messages.ecCurveLabel}
          value={ecCurve}
          onChange={onEcCurveChange}
        />
      ) : null}

      {keySource === "import" ? (
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor={keyPemId}>{messages.importLabel}</FieldLabel>
          <Textarea
            id={keyPemId}
            name="private-key-pem"
            value={keyPem}
            placeholder={messages.importPlaceholder}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            rows={6}
            className="font-mono text-xs"
            onChange={(event) => onKeyPemChange(event.target.value)}
          />
          <FieldDescription>{messages.importDescription}</FieldDescription>
        </Field>
      ) : null}
    </div>
  )
}

function KeySourceField({
  id,
  label,
  value,
  generateLabel,
  importLabel,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: KeySource
  generateLabel: string
  importLabel: string
  onChange: (value: KeySource) => void
}>) {
  return (
    <Field>
      <FieldLabel id={id}>{label}</FieldLabel>
      <ToggleGroup
        type="single"
        value={value}
        aria-labelledby={id}
        variant="outline"
        className="grid w-full grid-cols-2"
        onValueChange={(next) => {
          if (next === "generate" || next === "import") {
            onChange(next)
          }
        }}
      >
        <ToggleGroupItem value="generate" className="w-full">
          {generateLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="import" className="w-full">
          {importLabel}
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}

function AlgorithmField({
  id,
  label,
  value,
  rsaLabel,
  ecdsaLabel,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: KeyAlgorithm
  rsaLabel: string
  ecdsaLabel: string
  onChange: (value: KeyAlgorithm) => void
}>) {
  return (
    <Field>
      <FieldLabel id={id}>{label}</FieldLabel>
      <ToggleGroup
        type="single"
        value={value}
        aria-labelledby={id}
        variant="outline"
        className="grid w-full grid-cols-2"
        onValueChange={(next) => {
          if (next === "rsa" || next === "ecdsa") {
            onChange(next)
          }
        }}
      >
        <ToggleGroupItem value="rsa" className="w-full">
          {rsaLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="ecdsa" className="w-full">
          {ecdsaLabel}
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}

function RsaKeySizeField({
  id,
  label,
  value,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: RsaKeySize
  onChange: (value: RsaKeySize) => void
}>) {
  return (
    <Field>
      <FieldLabel id={id}>{label}</FieldLabel>
      <ToggleGroup
        type="single"
        value={String(value)}
        aria-labelledby={id}
        variant="outline"
        className="grid w-full grid-cols-3"
        onValueChange={(next) => {
          const size = Number(next) as RsaKeySize
          if (RSA_KEY_SIZES.includes(size)) {
            onChange(size)
          }
        }}
      >
        {RSA_KEY_SIZES.map((size) => (
          <ToggleGroupItem key={size} value={String(size)} className="w-full">
            {size}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  )
}

function RsaHashField({
  id,
  label,
  value,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: HashAlgorithm
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

function EcCurveField({
  id,
  label,
  value,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: EcCurve
  onChange: (value: EcCurve) => void
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
          if (EC_CURVES.includes(next as EcCurve)) {
            onChange(next as EcCurve)
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
  )
}

export { CsrKeySourceFields }
