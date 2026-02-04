import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EncryptOptions from './EncryptOptions.vue'

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
  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div class="n-form-item-gi"><slot /><slot name="feedback" /></div>',
  })
  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    emits: ['update:value'],
    template: '<div class="n-radio-group"><slot /></div>',
  })
  const NRadio = defineComponent({
    name: 'NRadio',
    props: ['value', 'disabled'],
    template: '<div class="n-radio" :data-value="value" :data-disabled="disabled"><slot /></div>',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NGrid: Base,
    NFormItemGi,
    NRadioGroup,
    NRadio,
    NSpace: Base,
    NText,
  }
})

describe('EncryptOptions', () => {
  it('renders output format options in raw mode', () => {
    const wrapper = mount(EncryptOptions, {
      props: {
        keyType: 'password',
        outputMode: 'raw',
        mode: 'GCM',
        keyLength: 256,
        outputFormat: 'hex',
        'onUpdate:outputMode': () => {},
        'onUpdate:mode': () => {},
        'onUpdate:keyLength': () => {},
        'onUpdate:outputFormat': () => {},
      },
    })

    expect(wrapper.findAll('.n-radio-group')).toHaveLength(4)
  })

  it('disables JWE for CTR and CBC for raw key JWE mode', () => {
    const wrapper = mount(EncryptOptions, {
      props: {
        keyType: 'raw',
        outputMode: 'jwe',
        mode: 'CTR',
        keyLength: 256,
        outputFormat: 'base64',
        'onUpdate:outputMode': () => {},
        'onUpdate:mode': () => {},
        'onUpdate:keyLength': () => {},
        'onUpdate:outputFormat': () => {},
      },
    })

    expect(wrapper.text()).toContain('ctrWarning')

    const jweRadio = wrapper.find('.n-radio[data-value="jwe"]')
    expect(jweRadio.attributes('data-disabled')).toBe('true')

    const cbcRadio = wrapper.find('.n-radio[data-value="CBC"]')
    expect(cbcRadio.attributes('data-disabled')).toBe('true')
  })

  it('emits updates from radio groups', () => {
    const onUpdateOutputMode = vi.fn()
    const onUpdateMode = vi.fn()
    const onUpdateKeyLength = vi.fn()
    const onUpdateOutputFormat = vi.fn()

    const wrapper = mount(EncryptOptions, {
      props: {
        keyType: 'password',
        outputMode: 'raw',
        mode: 'GCM',
        keyLength: 256,
        outputFormat: 'base64',
        'onUpdate:outputMode': onUpdateOutputMode,
        'onUpdate:mode': onUpdateMode,
        'onUpdate:keyLength': onUpdateKeyLength,
        'onUpdate:outputFormat': onUpdateOutputFormat,
      },
    })

    const groups = wrapper.findAllComponents({ name: 'NRadioGroup' })
    expect(groups).toHaveLength(4)

    groups[0]?.vm.$emit('update:value', 'jwe')
    groups[1]?.vm.$emit('update:value', 'CBC')
    groups[2]?.vm.$emit('update:value', 192)
    groups[3]?.vm.$emit('update:value', 'hex')

    expect(onUpdateOutputMode).toHaveBeenCalledWith('jwe')
    expect(onUpdateMode).toHaveBeenCalledWith('CBC')
    expect(onUpdateKeyLength).toHaveBeenCalledWith(192)
    expect(onUpdateOutputFormat).toHaveBeenCalledWith('hex')
  })
})
