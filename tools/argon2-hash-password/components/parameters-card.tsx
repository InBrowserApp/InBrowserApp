import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import {
  MAX_HASH_LENGTH,
  MAX_ITERATIONS,
  MAX_MEMORY_SIZE,
  MAX_PARALLELISM,
  MIN_HASH_LENGTH,
  MIN_ITERATIONS,
  MIN_MEMORY_SIZE,
  MIN_PARALLELISM,
} from "../client/constants"
import type { Argon2HashPasswordPageMessages } from "../client/types"

type ParametersCardProps = Readonly<{
  iterationsId: string
  memorySizeId: string
  parallelismId: string
  hashLengthId: string
  iterationsInput: string
  memorySizeInput: string
  parallelismInput: string
  hashLengthInput: string
  iterationsValid: boolean
  memorySizeValid: boolean
  parallelismValid: boolean
  hashLengthValid: boolean
  memoryDependencyValid: boolean
  memoryEstimate: string
  messages: Argon2HashPasswordPageMessages
  onIterationsChange: (value: string) => void
  onMemorySizeChange: (value: string) => void
  onParallelismChange: (value: string) => void
  onHashLengthChange: (value: string) => void
}>

function ParametersCard({
  iterationsId,
  memorySizeId,
  parallelismId,
  hashLengthId,
  iterationsInput,
  memorySizeInput,
  parallelismInput,
  hashLengthInput,
  iterationsValid,
  memorySizeValid,
  parallelismValid,
  hashLengthValid,
  memoryDependencyValid,
  memoryEstimate,
  messages,
  onIterationsChange,
  onMemorySizeChange,
  onParallelismChange,
  onHashLengthChange,
}: ParametersCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.parametersLabel}</CardTitle>
        <CardDescription>{messages.parametersDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field className="grid gap-2" data-invalid={!iterationsValid}>
            <FieldLabel htmlFor={iterationsId}>
              {messages.iterationsLabel}
            </FieldLabel>
            <Input
              id={iterationsId}
              name="iterations"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={MIN_ITERATIONS}
              max={MAX_ITERATIONS}
              step={1}
              value={iterationsInput}
              aria-invalid={!iterationsValid}
              onChange={(event) => {
                onIterationsChange(event.target.value)
              }}
            />
            {iterationsValid ? null : (
              <FieldError>{messages.iterationsInvalidMessage}</FieldError>
            )}
          </Field>

          <Field
            className="grid gap-2"
            data-invalid={!memorySizeValid || !memoryDependencyValid}
          >
            <FieldLabel htmlFor={memorySizeId}>
              {messages.memorySizeLabel}
            </FieldLabel>
            <Input
              id={memorySizeId}
              name="memory-size"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={MIN_MEMORY_SIZE}
              max={MAX_MEMORY_SIZE}
              step={8}
              value={memorySizeInput}
              aria-invalid={!memorySizeValid || !memoryDependencyValid}
              onChange={(event) => {
                onMemorySizeChange(event.target.value)
              }}
            />
            {memorySizeValid ? null : (
              <FieldError>{messages.memorySizeInvalidMessage}</FieldError>
            )}
            {memorySizeValid && !memoryDependencyValid ? (
              <FieldError>{messages.memoryDependencyInvalidMessage}</FieldError>
            ) : null}
          </Field>

          <Field className="grid gap-2" data-invalid={!parallelismValid}>
            <FieldLabel htmlFor={parallelismId}>
              {messages.parallelismLabel}
            </FieldLabel>
            <Input
              id={parallelismId}
              name="parallelism"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={MIN_PARALLELISM}
              max={MAX_PARALLELISM}
              step={1}
              value={parallelismInput}
              aria-invalid={!parallelismValid}
              onChange={(event) => {
                onParallelismChange(event.target.value)
              }}
            />
            {parallelismValid ? null : (
              <FieldError>{messages.parallelismInvalidMessage}</FieldError>
            )}
          </Field>

          <Field className="grid gap-2" data-invalid={!hashLengthValid}>
            <FieldLabel htmlFor={hashLengthId}>
              {messages.hashLengthLabel}
            </FieldLabel>
            <Input
              id={hashLengthId}
              name="hash-length"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={MIN_HASH_LENGTH}
              max={MAX_HASH_LENGTH}
              step={1}
              value={hashLengthInput}
              aria-invalid={!hashLengthValid}
              onChange={(event) => {
                onHashLengthChange(event.target.value)
              }}
            />
            {hashLengthValid ? null : (
              <FieldError>{messages.hashLengthInvalidMessage}</FieldError>
            )}
          </Field>

          <Field className="sm:col-span-2">
            <FieldDescription>
              {messages.estimatedMemoryLabel}: {memoryEstimate}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { ParametersCard }
