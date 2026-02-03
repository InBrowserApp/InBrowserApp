import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import JsonSchemaValidator from './JsonSchemaValidator.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

type ComputedAsyncOptions = {
  evaluating?: Ref<boolean>
}

const jsonSchemaMocks = vi.hoisted(() => ({
  detectSchemaDraft: vi.fn(),
  validateJsonSchema: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect } = await import('vue')
  return {
    ...actual,
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<unknown>
    },
    useDebounce: <T>(source: Ref<T>) => source,
    computedAsync: (
      getter: () => Promise<unknown>,
      initialValue: unknown,
      options?: ComputedAsyncOptions,
    ) => {
      const state = ref(initialValue)
      const evaluating = options?.evaluating
      watchEffect(() => {
        if (evaluating) evaluating.value = true
        void Promise.resolve(getter())
          .then((value) => {
            state.value = value
          })
          .finally(() => {
            if (evaluating) evaluating.value = false
          })
      })
      return state
    },
  }
})

vi.mock('@utils/json-schema', () => ({
  detectSchemaDraft: (...args: unknown[]) => jsonSchemaMocks.detectSchemaDraft(...args),
  validateJsonSchema: (...args: unknown[]) => jsonSchemaMocks.validateJsonSchema(...args),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const SchemaDataInputsStub = defineComponent({
  name: 'SchemaDataInputs',
  props: ['schemaStatus', 'dataStatus', 'schemaError', 'dataError', 'schemaValue', 'dataValue'],
  emits: ['update:schema-value', 'update:data-value'],
  template: '<div class="schema-data-inputs" />',
})

const ValidatorOptionsStub = defineComponent({
  name: 'ValidatorOptions',
  props: ['validateFormats', 'allErrors'],
  emits: ['update:validate-formats', 'update:all-errors'],
  template: '<div class="validator-options" />',
})

const ValidationResultStub = defineComponent({
  name: 'ValidationResult',
  props: [
    'state',
    'valid',
    'draftValue',
    'draftDetected',
    'errors',
    'errorsJson',
    'schemaError',
    'loading',
  ],
  template: '<div class="validation-result" />',
})

const WhatIsJsonSchemaStub = defineComponent({
  name: 'WhatIsJsonSchema',
  template: '<div class="what-is-json-schema" />',
})

const schemaKey = 'tools:json-schema-validator:schema'
const dataKey = 'tools:json-schema-validator:data'
const validateFormatsKey = 'tools:json-schema-validator:validate-formats'
const allErrorsKey = 'tools:json-schema-validator:all-errors'

const mountValidator = () =>
  mount(JsonSchemaValidator, {
    global: {
      stubs: {
        SchemaDataInputs: SchemaDataInputsStub,
        ValidatorOptions: ValidatorOptionsStub,
        ValidationResult: ValidationResultStub,
        WhatIsJsonSchema: WhatIsJsonSchemaStub,
      },
    },
  })

describe('JsonSchemaValidator', () => {
  beforeEach(() => {
    storage.clear()
    jsonSchemaMocks.detectSchemaDraft.mockReset()
    jsonSchemaMocks.validateJsonSchema.mockReset()
  })

  it('keeps empty state when inputs are missing', async () => {
    storage.set(schemaKey, ref(''))
    storage.set(dataKey, ref(''))
    storage.set(validateFormatsKey, ref(true))
    storage.set(allErrorsKey, ref(true))
    jsonSchemaMocks.detectSchemaDraft.mockReturnValue({ draft: '2020-12', detected: false })
    jsonSchemaMocks.validateJsonSchema.mockReturnValue({ valid: true, errors: [] })

    const wrapper = mountValidator()
    await flushPromises()

    const inputs = wrapper.findComponent(SchemaDataInputsStub)
    const result = wrapper.findComponent(ValidationResultStub)

    expect(inputs.props('schemaStatus')).toBeUndefined()
    expect(inputs.props('dataStatus')).toBeUndefined()
    expect(result.props('state')).toBe('empty')
    expect(result.props('valid')).toBe(false)
    expect(result.props('draftValue')).toBe('-')
    expect(jsonSchemaMocks.validateJsonSchema).not.toHaveBeenCalled()
  })

  it('marks invalid JSON inputs and stays empty', async () => {
    storage.set(schemaKey, ref('{'))
    storage.set(dataKey, ref('{}'))
    jsonSchemaMocks.detectSchemaDraft.mockReturnValue({ draft: '2020-12', detected: false })

    const wrapper = mountValidator()
    await flushPromises()

    const inputs = wrapper.findComponent(SchemaDataInputsStub)
    const result = wrapper.findComponent(ValidationResultStub)

    expect(inputs.props('schemaStatus')).toBe('error')
    expect(inputs.props('dataStatus')).toBe('success')
    expect(inputs.props('schemaError')).toBeTruthy()
    expect(result.props('state')).toBe('empty')
  })

  it('reports schema-object errors without validation', async () => {
    storage.set(schemaKey, ref('[]'))
    storage.set(dataKey, ref('{}'))
    jsonSchemaMocks.detectSchemaDraft.mockReturnValue({ draft: 'draft-07', detected: true })

    const wrapper = mountValidator()
    await flushPromises()

    const result = wrapper.findComponent(ValidationResultStub)
    expect(result.props('state')).toBe('schema-error')
    expect(result.props('schemaError')).toBe('schemaObjectError')
    expect(result.props('draftValue')).toBe('2020-12')
    expect(jsonSchemaMocks.detectSchemaDraft).not.toHaveBeenCalled()
    expect(jsonSchemaMocks.validateJsonSchema).not.toHaveBeenCalled()
  })

  it('validates schema data and surfaces errors', async () => {
    storage.set(schemaKey, ref('{"type":"object"}'))
    storage.set(dataKey, ref('{"name":1}'))
    storage.set(validateFormatsKey, ref(false))
    storage.set(allErrorsKey, ref(true))
    jsonSchemaMocks.detectSchemaDraft.mockReturnValue({ draft: 'draft-07', detected: true })
    jsonSchemaMocks.validateJsonSchema.mockReturnValue({
      valid: false,
      errors: [
        {
          instancePath: '/name',
          schemaPath: '#/properties/name',
          keyword: 'type',
          message: 'must be string',
          params: { type: 'string' },
        },
      ],
    })

    const wrapper = mountValidator()
    await flushPromises()

    expect(jsonSchemaMocks.detectSchemaDraft).toHaveBeenCalledWith({ type: 'object' })
    expect(jsonSchemaMocks.validateJsonSchema).toHaveBeenCalledWith(
      { type: 'object' },
      { name: 1 },
      { allErrors: true, validateFormats: false, strict: false },
    )

    const result = wrapper.findComponent(ValidationResultStub)
    expect(result.props('state')).toBe('validated')
    expect(result.props('valid')).toBe(false)
    expect(result.props('errors')).toHaveLength(1)
    expect(result.props('errorsJson')).toContain('"instancePath": "/name"')
    expect(result.props('draftValue')).toBe('Draft-07')
    expect(result.props('draftDetected')).toBe(true)
  })

  it('updates storage from schema and data inputs', async () => {
    storage.set(schemaKey, ref(''))
    storage.set(dataKey, ref(''))
    jsonSchemaMocks.detectSchemaDraft.mockReturnValue({ draft: '2020-12', detected: false })
    jsonSchemaMocks.validateJsonSchema.mockReturnValue({ valid: true, errors: [] })

    const wrapper = mountValidator()
    const inputs = wrapper.findComponent(SchemaDataInputsStub)

    inputs.vm.$emit('update:schema-value', '{"type":"object"}')
    inputs.vm.$emit('update:data-value', {
      text: () => Promise.reject(new Error('read failed')),
    })

    await flushPromises()
    await nextTick()

    expect(storage.get(schemaKey)?.value).toBe('{"type":"object"}')
    expect(storage.get(dataKey)?.value).toBe('')
  })
})
