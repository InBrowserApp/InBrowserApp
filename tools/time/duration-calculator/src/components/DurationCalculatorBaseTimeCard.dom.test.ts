import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DurationCalculatorBaseTimeCard from './DurationCalculatorBaseTimeCard.vue'

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: defineComponent({
    name: 'CopyToClipboardButton',
    template: '<button data-testid="copy-button" />',
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<select :value="value" @change="$emit(\'update:value\', $event.target.value)" />',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button type="button" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NInput,
    NSelect,
    NButton,
    NText: makeStub('NText'),
    NFlex: makeStub('NFlex'),
    NIcon: makeStub('NIcon'),
  }
})

describe('DurationCalculatorBaseTimeCard', () => {
  it('updates models and emits now', async () => {
    const wrapper = mount(DurationCalculatorBaseTimeCard, {
      props: {
        baseInput: '2024-01-01 00:00:00.000',
        baseTimeZone: 'UTC',
        baseStatus: 'success',
        baseError: false,
        baseOffsetLabel: 'UTC+00:00',
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
      },
    })

    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'Asia/Tokyo')
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', '2024-01-02 03:04:05.006')
    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:baseTimeZone')?.[0]).toEqual(['Asia/Tokyo'])
    expect(wrapper.emitted('update:baseInput')?.[0]).toEqual(['2024-01-02 03:04:05.006'])
    expect(wrapper.emitted('now')).toHaveLength(1)
    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(true)
  })

  it('hides copy action when base input is empty and shows error text', () => {
    const wrapper = mount(DurationCalculatorBaseTimeCard, {
      props: {
        baseInput: '',
        baseTimeZone: 'UTC',
        baseStatus: undefined,
        baseError: true,
        baseOffsetLabel: '',
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
      },
    })

    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Invalid date/time')
  })
})
