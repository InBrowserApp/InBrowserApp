import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="item" :data-label="label"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['code', 'depth'],
      template: '<span class="text"><slot /></span>',
    }),
  }
})
import ISBNResultIdentifiers from './ISBNResultIdentifiers.vue'
const baseResult = {
  input: '',
  normalized: '',
  length: 0,
  type: 'unknown' as const,
  isValid: false,
  isLengthValid: false,
  isFormatValid: false,
  isChecksumValid: false,
  expectedCheckDigit: null,
  actualCheckDigit: null,
  isbn10: null,
  isbn13: null,
  prefix: null,
}
describe('ISBNResultIdentifiers', () => {
  it('reports not available values when invalid', () => {
    const wrapper = mount(ISBNResultIdentifiers, {
      props: {
        validationResult: baseResult,
      },
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button class="copy" />',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.text()).toContain('-')
    expect(wrapper.findAll('.copy')).toHaveLength(0)
  })
  it('falls back to placeholders when valid values are missing', () => {
    const wrapper = mount(ISBNResultIdentifiers, {
      props: {
        validationResult: {
          ...baseResult,
          isValid: true,
          type: 'isbn-10',
          length: 10,
          isbn10: null,
          isbn13: null,
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
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.text()).toContain('-')
    expect(wrapper.findAll('.copy')).toHaveLength(0)
  })
  it('shows non-convertible ISBN-13 values', () => {
    const wrapper = mount(ISBNResultIdentifiers, {
      props: {
        validationResult: {
          ...baseResult,
          isValid: true,
          type: 'isbn-13',
          length: 13,
          isbn13: '9790306406156',
          prefix: '979',
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
    expect(wrapper.text()).toContain('Not convertible')
    expect(wrapper.text()).toContain('9790306406156')
    expect(wrapper.text()).toContain('979')
    expect(wrapper.text()).toContain('13')
    expect(wrapper.findAll('.copy')).toHaveLength(1)
  })
  it('shows ISBN-13 fallbacks when prefix is missing', () => {
    const wrapper = mount(ISBNResultIdentifiers, {
      props: {
        validationResult: {
          ...baseResult,
          isValid: true,
          type: 'isbn-13',
          length: 13,
          isbn10: null,
          isbn13: null,
          prefix: null,
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
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.text()).toContain('Not convertible')
    expect(wrapper.text()).toContain('13')
    expect(wrapper.findAll('.copy')).toHaveLength(0)
  })
  it('shows convertible ISBN-13 values and copies both identifiers', () => {
    const wrapper = mount(ISBNResultIdentifiers, {
      props: {
        validationResult: {
          ...baseResult,
          isValid: true,
          type: 'isbn-13',
          length: 13,
          isbn10: '0306406152',
          isbn13: '9780306406157',
          prefix: '978',
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
    expect(wrapper.text()).toContain('0306406152')
    expect(wrapper.text()).toContain('9780306406157')
    expect(wrapper.text()).toContain('978')
    expect(wrapper.findAll('.copy')).toHaveLength(2)
  })
})
