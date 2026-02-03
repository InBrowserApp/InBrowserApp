import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import TimeDifferenceInputs from './TimeDifferenceInputs.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="n-button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
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
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  return {
    NButton,
    NInput,
    NSelect,
    NFlex: Base,
    NGi: Base,
    NGrid: Base,
    NIcon: Base,
    NText: Base,
  }
})

const CopyStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  template: '<button class="copy-btn" />',
})

describe('TimeDifferenceInputs', () => {
  it('emits updates for inputs, time zones, and now actions', async () => {
    const wrapper = mount(TimeDifferenceInputs, {
      props: {
        startInput: '2024-01-01 00:00:00.000',
        endInput: '',
        startTimeZone: 'UTC',
        endTimeZone: 'UTC',
        startStatus: 'success',
        endStatus: undefined,
        startError: false,
        endError: true,
        startOffsetLabel: 'UTC+00:00',
        endOffsetLabel: '',
        timeZoneOptions: [
          { label: 'UTC', value: 'UTC' },
          { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
        ],
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<header><slot /></header>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: CopyStub,
        },
      },
    })

    const inputs = wrapper.findAll('input.n-input')
    await inputs[0]!.setValue('2024-01-02 00:00:00.000')
    await inputs[1]!.setValue('2024-01-03 00:00:00.000')

    expect(wrapper.emitted('update:startInput')?.[0]).toEqual(['2024-01-02 00:00:00.000'])
    expect(wrapper.emitted('update:endInput')?.[0]).toEqual(['2024-01-03 00:00:00.000'])

    const selects = wrapper.findAll('select.n-select')
    await selects[0]!.setValue('Asia/Tokyo')
    await selects[1]!.setValue('Asia/Tokyo')

    expect(wrapper.emitted('update:startTimeZone')?.[0]).toEqual(['Asia/Tokyo'])
    expect(wrapper.emitted('update:endTimeZone')?.[0]).toEqual(['Asia/Tokyo'])

    const nowButtons = wrapper.findAll('button.n-button').filter((button) => {
      return button.text().includes('now')
    })
    await nowButtons[0]!.trigger('click')
    await nowButtons[1]!.trigger('click')

    expect(wrapper.emitted('set-now')).toEqual([['start'], ['end']])
    expect(wrapper.findAll('.copy-btn')).toHaveLength(2)
  })
})
