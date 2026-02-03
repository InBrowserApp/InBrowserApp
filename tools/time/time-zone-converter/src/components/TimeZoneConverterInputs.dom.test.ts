import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TimeZoneConverterInputs from './TimeZoneConverterInputs.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div class="n-gi"><slot /></div>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon" />',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="n-select" />',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NButton,
    NFlex,
    NGi,
    NGrid,
    NIcon,
    NInput,
    NSelect,
    NText,
  }
})

const CopyToClipboardButtonStub = {
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button class="copy" :data-content="content" />',
}

describe('TimeZoneConverterInputs', () => {
  it('emits updates when inputs change', async () => {
    const wrapper = mount(TimeZoneConverterInputs, {
      props: {
        fromInput: '2024-01-01 00:00:00.000',
        toInput: '',
        fromTimeZone: 'UTC',
        toTimeZone: 'America/New_York',
        fromStatus: 'success',
        toStatus: undefined,
        fromError: false,
        toError: false,
        fromOffsetLabel: 'UTC+00:00',
        toOffsetLabel: 'UTC-05:00',
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const inputs = wrapper.findAll('input.n-input')
    await inputs[0]!.setValue('2024-01-02 00:00:00.000')
    await inputs[1]!.setValue('2024-01-03 00:00:00.000')

    expect(wrapper.emitted('update:fromInput')?.[0]).toEqual(['2024-01-02 00:00:00.000'])
    expect(wrapper.emitted('mark-edited')?.[0]).toEqual(['from'])
    expect(wrapper.emitted('update:toInput')?.[0]).toEqual(['2024-01-03 00:00:00.000'])
    expect(wrapper.emitted('mark-edited')?.[1]).toEqual(['to'])

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    selects[0]!.vm.$emit('update:value', 'Europe/London')
    selects[1]!.vm.$emit('update:value', 'UTC')

    expect(wrapper.emitted('update:fromTimeZone')?.[0]).toEqual(['Europe/London'])
    expect(wrapper.emitted('update:toTimeZone')?.[0]).toEqual(['UTC'])
  })

  it('emits set-now when clicking now buttons', async () => {
    const wrapper = mount(TimeZoneConverterInputs, {
      props: {
        fromInput: '',
        toInput: '',
        fromTimeZone: 'UTC',
        toTimeZone: 'UTC',
        fromStatus: undefined,
        toStatus: undefined,
        fromError: false,
        toError: false,
        fromOffsetLabel: '',
        toOffsetLabel: '',
        timeZoneOptions: [],
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const buttons = wrapper.findAll('button.n-button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('set-now')?.[0]).toEqual(['from'])
    expect(wrapper.emitted('set-now')?.[1]).toEqual(['to'])
  })

  it('shows validation errors when flags are set', () => {
    const wrapper = mount(TimeZoneConverterInputs, {
      props: {
        fromInput: 'bad',
        toInput: 'bad',
        fromTimeZone: 'UTC',
        toTimeZone: 'UTC',
        fromStatus: 'error',
        toStatus: 'error',
        fromError: true,
        toError: true,
        fromOffsetLabel: '',
        toOffsetLabel: '',
        timeZoneOptions: [],
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('invalid-date-time')
  })

  it('renders copy buttons when inputs are provided', () => {
    const wrapper = mount(TimeZoneConverterInputs, {
      props: {
        fromInput: '2024-01-01 00:00:00.000',
        toInput: '2024-01-02 00:00:00.000',
        fromTimeZone: 'UTC',
        toTimeZone: 'UTC',
        fromStatus: undefined,
        toStatus: undefined,
        fromError: false,
        toError: false,
        fromOffsetLabel: '',
        toOffsetLabel: '',
        timeZoneOptions: [],
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.findAllComponents(CopyToClipboardButtonStub)).toHaveLength(2)
  })
})
