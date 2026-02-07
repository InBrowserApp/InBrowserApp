import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import CsrKeySourceSection from './CsrKeySourceSection.vue'

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: { type: [String, Object], default: '' },
    accept: { type: String, default: '' },
    status: { type: String, default: undefined },
  },
  emits: ['update:value'],
  setup(_, { emit }) {
    return () =>
      h('textarea', {
        onInput: (event: Event) =>
          emit('update:value', (event.target as HTMLTextAreaElement).value),
      })
  },
})

const WrapperStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const createI18nPlugin = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

const mountSection = () =>
  mount(CsrKeySourceSection, {
    props: {
      keySource: 'generate',
      algorithm: 'rsa',
      rsaKeySize: 2048,
      rsaHash: 'SHA-256',
      ecCurve: 'P-256',
      keyInput: '',
      keyAccept: '.pem',
      rsaKeySizeOptions: [
        { label: '2048', value: 2048 },
        { label: '4096', value: 4096 },
      ],
      rsaHashOptions: [
        { label: 'SHA-256', value: 'SHA-256' },
        { label: 'SHA-512', value: 'SHA-512' },
      ],
      ecCurveOptions: [
        { label: 'P-256', value: 'P-256' },
        { label: 'P-521', value: 'P-521' },
      ],
    },
    global: {
      plugins: [createI18nPlugin()],
      stubs: {
        NFormItem: WrapperStub,
        NRadioButton: WrapperStub,
        NRadioGroup: WrapperStub,
        NSelect: WrapperStub,
        NText: WrapperStub,
        TextOrFileInput: TextOrFileInputStub,
        ToolSection: WrapperStub,
        ToolSectionHeader: WrapperStub,
      },
    },
  })

describe('CsrKeySourceSection', () => {
  it('syncs defineModel bindings for key source settings', async () => {
    const wrapper = mountSection()
    const vm = wrapper.vm as unknown as {
      keySource: string
      algorithm: string
      rsaKeySize: number
      rsaHash: string
      ecCurve: string
    }

    vm.keySource = 'import'
    vm.algorithm = 'ecdsa'
    vm.rsaKeySize = 4096
    vm.rsaHash = 'SHA-512'
    vm.ecCurve = 'P-521'
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:keySource')?.[0]).toEqual(['import'])
    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['ecdsa'])
    expect(wrapper.emitted('update:rsaKeySize')?.[0]).toEqual([4096])
    expect(wrapper.emitted('update:rsaHash')?.[0]).toEqual(['SHA-512'])
    expect(wrapper.emitted('update:ecCurve')?.[0]).toEqual(['P-521'])
    expect(wrapper.text()).toContain('Encrypted keys are not supported.')
  })

  it('renders import mode and forwards private key input updates', async () => {
    const wrapper = mountSection()
    await wrapper.setProps({
      keySource: 'import',
      keyInputStatus: 'error',
    })

    const keyInput = wrapper.findComponent(TextOrFileInputStub)
    expect(keyInput.props('accept')).toBe('.pem')
    expect(keyInput.props('status')).toBe('error')

    keyInput.vm.$emit('update:value', 'PEM-KEY')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:keyInput')?.[0]).toEqual(['PEM-KEY'])
    expect(wrapper.text()).toContain('RSA PRIVATE KEY')
  })
})
