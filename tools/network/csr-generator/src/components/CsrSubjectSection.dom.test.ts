import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import CsrSubjectSection from './CsrSubjectSection.vue'

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: { type: [String, Number], default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: String(props.value ?? ''),
        onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
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
      subjectTitle: 'Subject',
      commonName: 'CN',
      organization: 'O',
      organizationalUnit: 'OU',
      country: 'C',
      state: 'ST',
      locality: 'L',
      emailAddress: 'Email',
      subjectHint: 'Subject hint',
    },
  },
})

describe('CsrSubjectSection', () => {
  it('updates each subject field through v-model handlers', async () => {
    const subject = {
      commonName: 'example.com',
      organization: '',
      organizationalUnit: '',
      country: '',
      state: '',
      locality: '',
      emailAddress: '',
    }

    const wrapper = mount(CsrSubjectSection, {
      props: { subject },
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

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(7)

    await inputs[0]!.setValue('example.org')
    await inputs[1]!.setValue('Acme Corp')
    await inputs[2]!.setValue('Security')
    await inputs[3]!.setValue('US')
    await inputs[4]!.setValue('CA')
    await inputs[5]!.setValue('San Francisco')
    await inputs[6]!.setValue('security@example.org')

    expect(subject).toEqual({
      commonName: 'example.org',
      organization: 'Acme Corp',
      organizationalUnit: 'Security',
      country: 'US',
      state: 'CA',
      locality: 'San Francisco',
      emailAddress: 'security@example.org',
    })
  })
})
