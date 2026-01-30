import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { h } from 'vue'
import type { JsonSchemaValidationError } from '@utils/json-schema'
import ValidationResult from './ValidationResult.vue'

type ValidationResultProps = {
  state: 'empty' | 'schema-error' | 'validated'
  valid: boolean
  draftValue: string
  draftDetected: boolean
  errors: JsonSchemaValidationError[]
  errorsJson: string
  schemaError: string
  loading: boolean
}

const baseProps: ValidationResultProps = {
  state: 'empty',
  valid: false,
  draftValue: '-',
  draftDetected: false,
  errors: [],
  errorsJson: '',
  schemaError: '',
  loading: false,
}

const withProviders = (props: ValidationResultProps) => ({
  render() {
    return h(NConfigProvider, null, {
      default: () =>
        h(NMessageProvider, null, {
          default: () => h(ValidationResult, props),
        }),
    })
  },
})

describe('ValidationResult', () => {
  it('shows empty message when waiting for inputs', () => {
    const wrapper = mount(withProviders(baseProps))
    expect(wrapper.text()).toContain('Provide a valid JSON Schema and JSON data to see results')
  })

  it('renders errors when provided', () => {
    const props: ValidationResultProps = {
      ...baseProps,
      state: 'validated',
      valid: false,
      errors: [
        {
          instancePath: '/name',
          schemaPath: '#/properties/name/type',
          keyword: 'type',
          message: 'must be string',
          params: { type: 'string' },
        },
      ],
      errorsJson: '[{"path":"/name"}]',
    }
    const wrapper = mount(withProviders(props))

    expect(wrapper.text()).toContain('must be string')
    expect(wrapper.text()).toContain('Errors (1)')
  })
})
