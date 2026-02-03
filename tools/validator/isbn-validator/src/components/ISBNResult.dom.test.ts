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
    NDescriptions: defineComponent({
      name: 'NDescriptions',
      props: ['column', 'bordered', 'labelPlacement'],
      template: '<div class="descriptions"><slot /></div>',
    }),
  }
})

import ISBNResult from './ISBNResult.vue'

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

describe('ISBNResult', () => {
  it('renders the result header and summary sections', () => {
    const wrapper = mount(ISBNResult, {
      props: {
        validationResult: baseResult,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2 class="section-header"><slot /></h2>',
          },
          ISBNResultSummary: {
            template: '<div data-testid="summary" />',
          },
          ISBNResultIdentifiers: {
            template: '<div data-testid="identifiers" />',
          },
        },
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('result')
    expect(wrapper.find('[data-testid="summary"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="identifiers"]').exists()).toBe(true)
  })
})
