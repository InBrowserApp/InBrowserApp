import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="item" :data-label="label"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="flex"><slot /></div>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      props: ['type', 'size'],
      template: '<span class="tag" :data-type="type"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['code', 'depth'],
      template: '<span class="text"><slot /></span>',
    }),
  }
})

import ISBNResultSummary from './ISBNResultSummary.vue'

const baseResult = {
  input: '',
  normalized: '',
  length: 10,
  type: 'isbn-10' as const,
  isValid: false,
  isLengthValid: true,
  isFormatValid: true,
  isChecksumValid: true,
  expectedCheckDigit: '2',
  actualCheckDigit: '2',
  isbn10: '0306406152',
  isbn13: '9780306406157',
  prefix: null,
}

describe('ISBNResultSummary', () => {
  it('renders type, normalized value, and checksum status', () => {
    const wrapper = mount(ISBNResultSummary, {
      props: {
        validationResult: {
          ...baseResult,
          normalized: '0306406152',
          isChecksumValid: true,
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button class="copy" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('isbn10')
    expect(wrapper.text()).toContain('expected: 2')
    expect(wrapper.text()).toContain('actual: 2')
    expect(wrapper.find('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.find('.copy').exists()).toBe(true)
  })

  it('falls back to unknown type and missing digits', () => {
    const wrapper = mount(ISBNResultSummary, {
      props: {
        validationResult: {
          ...baseResult,
          type: 'unknown',
          normalized: '',
          expectedCheckDigit: null,
          actualCheckDigit: null,
          isChecksumValid: false,
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button class="copy" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('unknown')
    expect(wrapper.text()).toContain('expected: -')
    expect(wrapper.text()).toContain('actual: -')
    expect(wrapper.find('.tag').attributes('data-type')).toBe('error')
    expect(wrapper.find('.copy').exists()).toBe(false)
  })
})
