import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type {
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
} from "../core/csr"
import type { CsrGeneratorMessages } from "../client/types"
import {
  AlgorithmField,
  EcCurveField,
  KeySourceField,
  RsaHashField,
  RsaKeySizeField,
} from "./csr-toggle-fields"

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

export { CsrKeySourceFields }
