import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CreditCardResult from './CreditCardResult.vue'
import type { ValidationResult } from '../data/cardBrands'

const BrandIconStub = defineComponent({
  name: 'BrandIcon',
  template: '<svg class="brand-icon" />',
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptions: defineComponent({
      name: 'NDescriptions',
      template: '<div class="n-descriptions"><slot /></div>',
    }),
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<div class="n-descriptions-item"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      props: {
        component: {
          type: Object,
          default: () => ({}),
        },
      },
      template: '<span class="n-icon" />',
    }),
    NTag: defineComponent({
      name: 'NTag',
      props: {
        type: {
          type: String,
          default: 'default',
        },
        size: {
          type: String,
          default: 'small',
        },
      },
      template: '<span class="n-tag" :data-type="type"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: {
        depth: {
          type: String,
          default: undefined,
        },
        tag: {
          type: String,
          default: 'span',
        },
        code: {
          type: Boolean,
          default: false,
        },
      },
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['text', 'size'],
    template: '<button class="copy-button" :data-text="text"></button>',
  },
}))

vi.mock('@vicons/fluent/QuestionCircle16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'HelpCircleIcon',
      template: '<svg class="help-icon" />',
    }),
  }
})

const createResult = (overrides: Partial<ValidationResult> = {}): ValidationResult => ({
  isValid: false,
  brand: null,
  formattedNumber: '',
  isLuhnValid: false,
  isLengthValid: false,
  digits: '',
  ...overrides,
})

describe('CreditCardResult', () => {
  it('renders brand details and copy button when a brand is detected', () => {
    const brand = {
      id: 'visa',
      name: 'Visa',
      patterns: ['4'],
      lengths: [16],
      icon: BrandIconStub,
      cvcLength: 3,
      formatPattern: [4, 4, 4, 4],
    }

    const wrapper = mount(CreditCardResult, {
      props: {
        validationResult: createResult({
          isValid: true,
          isLuhnValid: true,
          isLengthValid: true,
          brand,
          formattedNumber: '4111 1111 1111 1111',
          digits: '4111111111111111',
        }),
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="tool-section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h3 class="tool-header"><slot /></h3>',
          },
        },
      },
    })

    const tags = wrapper.findAll('.n-tag')
    expect(tags).toHaveLength(2)
    expect(tags[0]?.attributes('data-type')).toBe('success')
    expect(tags[1]?.attributes('data-type')).toBe('success')

    const icon = wrapper.findComponent({ name: 'NIcon' })
    expect(icon.props('component')?.name).toBe('BrandIcon')

    const copyButton = wrapper.findComponent({ name: 'CopyToClipboardButton' })
    expect(copyButton.exists()).toBe(true)
    expect(copyButton.props('text')).toBe('4111111111111111')

    expect(wrapper.text()).toContain('Visa')
    expect(wrapper.text()).toContain('16')
    expect(wrapper.text()).toContain('digits')
  })

  it('renders unknown brand details when a brand is missing', () => {
    const wrapper = mount(CreditCardResult, {
      props: {
        validationResult: createResult({
          isValid: false,
          isLuhnValid: false,
          isLengthValid: false,
          formattedNumber: '',
          digits: '',
        }),
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="tool-section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h3 class="tool-header"><slot /></h3>',
          },
        },
      },
    })

    const tags = wrapper.findAll('.n-tag')
    expect(tags).toHaveLength(2)
    expect(tags[0]?.attributes('data-type')).toBe('error')
    expect(tags[1]?.attributes('data-type')).toBe('error')

    expect(wrapper.findComponent({ name: 'CopyToClipboardButton' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Unknown')
    expect(wrapper.text()).not.toContain('Expected:')
    expect(wrapper.text()).not.toContain('CVC Length')
  })
})
