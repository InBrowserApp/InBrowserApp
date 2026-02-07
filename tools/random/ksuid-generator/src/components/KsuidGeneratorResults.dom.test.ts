import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import KsuidGeneratorResults from './KsuidGeneratorResults.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: { seconds?: number }) =>
        key === 'generatedAt' ? `generatedAt:${params?.seconds}` : key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    template: '<textarea :value="value" :placeholder="placeholder" />',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span><slot /></span>',
  })

  return { NFlex, NInput, NText }
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  template: '<button class="copy" :data-content="content" />',
})

const RegenerateButtonStub = defineComponent({
  name: 'RegenerateButton',
  emits: ['click'],
  template: '<button class="regen" @click="$emit(\'click\')">regen</button>',
})

describe('KsuidGeneratorResults', () => {
  const global = {
    stubs: {
      ToolSection: { template: '<section><slot /></section>' },
      ToolSectionHeader: { template: '<h2><slot /></h2>' },
      CopyToClipboardButton: CopyToClipboardButtonStub,
      RegenerateButton: RegenerateButtonStub,
    },
  }

  it('renders placeholder and hides generated timestamp when output is empty', () => {
    const wrapper = mount(KsuidGeneratorResults, {
      props: {
        output: '',
        generatedAtUnixSeconds: 123,
      },
      global,
    })

    const textarea = wrapper.get('textarea')
    expect((textarea.element as HTMLTextAreaElement).placeholder).toBe('placeholder')
    expect(wrapper.text()).not.toContain('generatedAt:123')

    const copy = wrapper.get('button.copy')
    expect(copy.attributes('data-content')).toBe('')
  })

  it('shows generated timestamp text and emits regenerate', async () => {
    const wrapper = mount(KsuidGeneratorResults, {
      props: {
        output: 'abc123',
        generatedAtUnixSeconds: 456,
      },
      global,
    })

    expect(wrapper.text()).toContain('generatedAt:456')

    await wrapper.get('button.regen').trigger('click')
    expect(wrapper.emitted('regenerate')).toHaveLength(1)
  })
})
