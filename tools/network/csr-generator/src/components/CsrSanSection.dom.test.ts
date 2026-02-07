import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import CsrSanSection from './CsrSanSection.vue'

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: { type: [String, Number], default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('textarea', {
        value: String(props.value ?? ''),
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

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      sanTitle: 'SAN',
      sanDnsLabel: 'DNS',
      sanIpLabel: 'IP',
      sanEmailLabel: 'Email',
      sanUriLabel: 'URI',
      sanDnsPlaceholder: 'dns',
      sanIpPlaceholder: 'ip',
      sanEmailPlaceholder: 'mail',
      sanUriPlaceholder: 'uri',
      sanHint: 'SAN hint',
    },
  },
})

describe('CsrSanSection', () => {
  it('emits model updates for every SAN field', async () => {
    const wrapper = mount(CsrSanSection, {
      props: {
        sanDns: '',
        sanIp: '',
        sanEmail: '',
        sanUri: '',
      },
      global: {
        plugins: [i18n],
        stubs: {
          NInput: NInputStub,
          'n-input': NInputStub,
          NFormItemGi: WrapperStub,
          'n-form-item-gi': WrapperStub,
          NGrid: WrapperStub,
          NText: WrapperStub,
          ToolSection: WrapperStub,
          ToolSectionHeader: WrapperStub,
        },
      },
    })

    const inputs = wrapper.findAll('textarea')
    expect(inputs).toHaveLength(4)

    await inputs[0]!.setValue('example.org')
    await inputs[1]!.setValue('192.0.2.55')
    await inputs[2]!.setValue('security@example.org')
    await inputs[3]!.setValue('https://example.org')

    expect(wrapper.emitted('update:sanDns')?.[0]).toEqual(['example.org'])
    expect(wrapper.emitted('update:sanIp')?.[0]).toEqual(['192.0.2.55'])
    expect(wrapper.emitted('update:sanEmail')?.[0]).toEqual(['security@example.org'])
    expect(wrapper.emitted('update:sanUri')?.[0]).toEqual(['https://example.org'])
  })
})
