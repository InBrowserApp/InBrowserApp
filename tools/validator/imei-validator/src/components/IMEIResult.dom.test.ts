import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { IMEIValidationResult } from '../data/imei'
import IMEIResult from './IMEIResult.vue'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')

  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section class="tool-section"><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2 class="tool-section-header"><slot /></h2>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NDescriptions: defineComponent({
      name: 'NDescriptions',
      props: ['column', 'bordered', 'labelPlacement'],
      template: '<div class="n-descriptions"><slot /></div>',
    }),
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="n-descriptions-item"><slot /></div>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      props: ['type', 'size'],
      template: '<span class="n-tag" :data-type="type"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['depth', 'code'],
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

function makeResult(overrides: Partial<IMEIValidationResult> = {}): IMEIValidationResult {
  return {
    input: '',
    normalized: '',
    length: 0,
    tac: null,
    serialNumber: null,
    checkDigit: null,
    expectedCheckDigit: null,
    isLengthValid: false,
    isFormatValid: false,
    isChecksumValid: false,
    isValid: false,
    reason: 'empty',
    ...overrides,
  }
}

describe('IMEIResult', () => {
  it('renders a valid state', () => {
    const wrapper = mount(IMEIResult, {
      props: {
        validationResult: makeResult({
          normalized: '490154203237518',
          checkDigit: '8',
          expectedCheckDigit: '8',
          isValid: true,
          reason: 'valid',
        }),
      },
    })

    expect(wrapper.text()).toContain('Validation Result')
    expect(wrapper.text()).toContain('Valid IMEI')
    expect(wrapper.text()).toContain('490154203237518')
    expect(wrapper.find('.n-tag').attributes('data-type')).toBe('success')
  })

  it('renders all invalid reason labels', () => {
    const expectations: Array<[IMEIValidationResult['reason'], string]> = [
      ['invalid-length', 'IMEI must be exactly 15 digits'],
      ['invalid-format', 'IMEI must contain digits only'],
      ['invalid-checksum', 'Invalid checksum digit'],
      ['empty', 'Invalid IMEI'],
    ]

    for (const [reason, label] of expectations) {
      const wrapper = mount(IMEIResult, {
        props: {
          validationResult: makeResult({
            reason,
            normalized: '',
            checkDigit: null,
            expectedCheckDigit: null,
            isValid: false,
          }),
        },
      })

      expect(wrapper.text()).toContain(label)
      expect(wrapper.find('.n-tag').attributes('data-type')).toBe('error')
      expect(wrapper.text()).toContain('-')
    }
  })
})
