import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { h } from 'vue'
import type { JsonSchemaValidationError } from '@utils/json-schema'
import ValidationResult from './ValidationResult.vue'

type ValidationResultProps = {
  title: string
  statusLabel: string
  statusValue: string
  statusType: 'success' | 'error' | 'info' | 'warning'
  draftLabel: string
  draftValue: string
  draftHint: string
  errorsLabel: string
  errorsCount: number
  errorsTitle: string
  errors: JsonSchemaValidationError[]
  errorsJson: string
  columnsLabels: {
    path: string
    message: string
    keyword: string
  }
  noErrorsLabel: string
  schemaError: string
  emptyMessage: string
  loading: boolean
}

const baseProps: ValidationResultProps = {
  title: 'Validation Result',
  statusLabel: 'Status',
  statusValue: 'Waiting',
  statusType: 'info',
  draftLabel: 'Schema Draft',
  draftValue: '-',
  draftHint: '',
  errorsLabel: 'Errors',
  errorsCount: 0,
  errorsTitle: 'Errors',
  errors: [],
  errorsJson: '',
  columnsLabels: {
    path: 'Path',
    message: 'Message',
    keyword: 'Keyword',
  },
  noErrorsLabel: 'No errors',
  schemaError: '',
  emptyMessage: 'Provide a valid JSON Schema and JSON data to see results',
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
    expect(wrapper.text()).toContain(baseProps.emptyMessage)
  })

  it('renders errors when provided', () => {
    const props = {
      ...baseProps,
      statusValue: 'Invalid',
      statusType: 'error',
      errorsCount: 1,
      errorsTitle: 'Errors (1)',
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
