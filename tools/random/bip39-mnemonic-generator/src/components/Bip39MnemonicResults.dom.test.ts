import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Bip39MnemonicResults from './Bip39MnemonicResults.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
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

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy-button" :data-content="content">Copy</button>',
  },
  RegenerateButton: {
    name: 'RegenerateButton',
    emits: ['click'],
    template: '<button class="regenerate-button" @click="$emit(\'click\')">Regenerate</button>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NAlert = defineComponent({
    name: 'NAlert',
    template: '<div class="n-alert"><slot /></div>',
  })
  const NDivider = defineComponent({
    name: 'NDivider',
    template: '<hr class="n-divider" />',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: { value: { type: String, default: '' } },
    template: '<input class="n-input" :data-value="value" />',
  })
  const NTag = defineComponent({
    name: 'NTag',
    template: '<span class="n-tag"><slot /></span>',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NAlert,
    NDivider,
    NFlex: Base,
    NInput,
    NSpace: Base,
    NTag,
    NText,
  }
})

const baseProps = {
  activeTab: 'generate' as const,
  generatedMnemonic: 'alpha beta',
  generatedEntropy: 'deadbeef',
  validationState: 'empty' as const,
  validationWordCount: 0,
  validationEntropy: '',
  entropyMnemonic: '',
  mnemonicEntropy: '',
  entropyHasError: false,
  mnemonicHasError: false,
}

describe('Bip39MnemonicResults', () => {
  it('shows generate outputs and emits regenerate', async () => {
    const wrapper = mount(Bip39MnemonicResults, { props: baseProps })

    expect(wrapper.find('.copy-button[data-content="alpha beta"]').exists()).toBe(true)
    expect(wrapper.find('.copy-button[data-content="deadbeef"]').exists()).toBe(true)

    await wrapper.find('.regenerate-button').trigger('click')
    expect(wrapper.emitted('regenerate')).toHaveLength(1)
  })

  it('shows validation empty state', () => {
    const wrapper = mount(Bip39MnemonicResults, {
      props: {
        ...baseProps,
        activeTab: 'validate',
        validationState: 'empty',
      },
    })

    expect(wrapper.text()).toContain('validation-empty')
    expect(wrapper.find('.n-tag').exists()).toBe(false)
  })

  it('shows invalid validation state with error', () => {
    const wrapper = mount(Bip39MnemonicResults, {
      props: {
        ...baseProps,
        activeTab: 'validate',
        validationState: 'invalid',
        validationWordCount: 12,
      },
    })

    expect(wrapper.text()).toContain('invalid')
    expect(wrapper.text()).toContain('word-count-result')
    expect(wrapper.find('.n-alert').text()).toContain('mnemonic-error')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })

  it('shows valid validation state with entropy output', () => {
    const wrapper = mount(Bip39MnemonicResults, {
      props: {
        ...baseProps,
        activeTab: 'validate',
        validationState: 'valid',
        validationWordCount: 24,
        validationEntropy: 'cafebabe',
      },
    })

    expect(wrapper.text()).toContain('valid')
    expect(wrapper.find('.copy-button[data-content="cafebabe"]').exists()).toBe(true)
    expect(wrapper.find('.n-alert').exists()).toBe(false)
  })

  it('toggles convert errors and outputs', async () => {
    const wrapper = mount(Bip39MnemonicResults, {
      props: {
        ...baseProps,
        activeTab: 'convert',
        entropyHasError: true,
        mnemonicHasError: true,
      },
    })

    expect(wrapper.text()).toContain('entropy-error')
    expect(wrapper.text()).toContain('mnemonic-error')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)

    await wrapper.setProps({
      entropyHasError: false,
      mnemonicHasError: false,
      entropyMnemonic: 'mnemonic words',
      mnemonicEntropy: '1234',
    })

    expect(wrapper.find('.copy-button[data-content="mnemonic words"]').exists()).toBe(true)
    expect(wrapper.find('.copy-button[data-content="1234"]').exists()).toBe(true)
  })
})
