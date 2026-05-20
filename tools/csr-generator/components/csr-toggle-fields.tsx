import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
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

export {
  AlgorithmField,
  EcCurveField,
  KeySourceField,
  RsaHashField,
  RsaKeySizeField,
}
