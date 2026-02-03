import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { Bip39WordCount, Bip39WordlistName } from '@utils/bip39'
import Bip39MnemonicOptions from './Bip39MnemonicOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: { bits?: number }) =>
        typeof params?.bits === 'number' ? `${key}:${params.bits}` : key,
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NTabs = defineComponent({
    name: 'NTabs',
    props: { value: { type: String, default: '' } },
    emits: ['update:value'],
    template: '<div class="n-tabs"><slot /></div>',
  })
  const NTabPane = defineComponent({
    name: 'NTabPane',
    props: { name: { type: String, default: '' } },
    template: '<div class="n-tab-pane"><slot name="tab" /><slot /></div>',
  })
  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: { label: { type: String, default: '' } },
    template: '<div class="n-form-item"><slot /></div>',
  })
  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: { type: [String, Number], default: '' },
      options: { type: Array, default: () => [] },
    },
    emits: ['update:value'],
    template: '<div class="n-select" />',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      type: { type: String, default: '' },
    },
    emits: ['update:value'],
    template: '<div class="n-input" />',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NTabs,
    NTabPane,
    NFlex: Base,
    NFormItem,
    NIcon: Base,
    NSelect,
    NInput,
    NText,
  }
})

vi.mock('@vicons/fluent/ArrowSwap20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ArrowSwapIcon',
      template: '<span class="icon arrow-swap" />',
    }),
  }
})

vi.mock('@vicons/fluent/CheckmarkCircle20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'CheckmarkIcon',
      template: '<span class="icon checkmark" />',
    }),
  }
})

vi.mock('@vicons/fluent/Key20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'KeyIcon',
      template: '<span class="icon key" />',
    }),
  }
})

describe('Bip39MnemonicOptions', () => {
  it('renders labels and emits model updates', () => {
    const wordlistOptions: Array<{ label: string; value: Bip39WordlistName }> = [
      { label: 'English', value: 'english' },
      { label: 'Spanish', value: 'spanish' },
    ]
    const wordCountOptions: Array<{ label: string; value: Bip39WordCount }> = [
      { label: '12', value: 12 },
      { label: '24', value: 24 },
    ]

    const wrapper = mount(Bip39MnemonicOptions, {
      props: {
        activeTab: 'generate',
        wordlist: 'english',
        wordCount: 12,
        validationMnemonic: '',
        entropyInput: '',
        convertMnemonic: '',
        wordlistOptions,
        wordCountOptions,
        strengthBits: 128,
      },
    })

    expect(wrapper.text()).toContain('options')
    expect(wrapper.text()).toContain('tab-generate')
    expect(wrapper.text()).toContain('tab-validate')
    expect(wrapper.text()).toContain('tab-convert')
    expect(wrapper.text()).toContain('entropy-bits:128')

    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'validate')
    expect(wrapper.emitted('update:activeTab')?.[0]).toEqual(['validate'])

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    const wordlistSelect = selects.find((select) => {
      const options = select.props('options') as Array<{ value?: unknown }>
      return typeof options?.[0]?.value === 'string'
    })
    const wordCountSelect = selects.find((select) => {
      const options = select.props('options') as Array<{ value?: unknown }>
      return typeof options?.[0]?.value === 'number'
    })

    expect(wordlistSelect).toBeTruthy()
    expect(wordCountSelect).toBeTruthy()

    wordlistSelect?.vm.$emit('update:value', 'spanish')
    expect(wrapper.emitted('update:wordlist')?.[0]).toEqual(['spanish'])

    wordCountSelect?.vm.$emit('update:value', 24)
    expect(wrapper.emitted('update:wordCount')?.[0]).toEqual([24])

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    expect(inputs).toHaveLength(3)
    const [validationInput, entropyInput, convertInput] = inputs
    validationInput!.vm.$emit('update:value', 'valid mnemonic')
    entropyInput!.vm.$emit('update:value', 'deadbeef')
    convertInput!.vm.$emit('update:value', 'convert mnemonic')

    expect(wrapper.emitted('update:validationMnemonic')?.[0]).toEqual(['valid mnemonic'])
    expect(wrapper.emitted('update:entropyInput')?.[0]).toEqual(['deadbeef'])
    expect(wrapper.emitted('update:convertMnemonic')?.[0]).toEqual(['convert mnemonic'])
  })
})
