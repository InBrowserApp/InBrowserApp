import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DecryptOptions from './DecryptOptions.vue'

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

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    emits: ['update:value'],
    template: '<div class="n-radio-group"><slot /></div>',
  })
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NRadioGroup,
    NRadio: Base,
    NSpace: Base,
  }
})

describe('DecryptOptions', () => {
  it('renders options when not in JWE mode', () => {
    const wrapper = mount(DecryptOptions, {
      props: {
        isJweMode: false,
        mode: 'GCM',
        keyLength: 256,
        inputFormat: 'base64',
        'onUpdate:mode': () => {},
        'onUpdate:keyLength': () => {},
        'onUpdate:inputFormat': () => {},
      },
    })

    expect(wrapper.find('.tool-section').exists()).toBe(true)
    expect(wrapper.findAll('.n-radio-group')).toHaveLength(3)
  })

  it('hides options when in JWE mode', () => {
    const wrapper = mount(DecryptOptions, {
      props: {
        isJweMode: true,
        mode: 'GCM',
        keyLength: 256,
        inputFormat: 'base64',
        'onUpdate:mode': () => {},
        'onUpdate:keyLength': () => {},
        'onUpdate:inputFormat': () => {},
      },
    })

    expect(wrapper.find('.tool-section').exists()).toBe(false)
  })
})
