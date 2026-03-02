import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IcalEventRemindersSection from './IcalEventRemindersSection.vue'
vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<header><slot /></header>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /><slot name="icon" /></div>',
  })
  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button type="button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })
  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    emits: ['update:value'],
    template: '<input class="n-input-number" @input="$emit(\'update:value\', 30)" />',
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
  const NInput = defineComponent({
    name: 'NInput',
    emits: ['update:value'],
    template: '<input class="n-input" @input="$emit(\'update:value\', \'Ping\')" />',
  })
  const NSwitch = defineComponent({
    name: 'NSwitch',
    emits: ['update:value'],
    template: '<button type="button" class="n-switch" @click="$emit(\'update:value\', true)" />',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton,
    NIcon: StubBase,
    NInput,
    NInputNumber,
    NSelect,
    NSwitch,
    NText: StubBase,
  }
})
describe('IcalEventRemindersSection', () => {
  it('emits defaults and reminder updates', async () => {
    type ReminderForm = {
      amount: number
      unit: string
      description: string
    }
    const wrapper = mount(IcalEventRemindersSection, {
      props: {
        remindersEnabled: false,
        reminders: [
          { amount: 15, unit: 'minutes', description: '' },
          { amount: 5, unit: 'hours', description: 'second' },
        ],
      },
    })
    const getReminderEmits = () => wrapper.emitted('update:reminders') as Array<[ReminderForm[]]>
    await nextTick()
    expect(wrapper.emitted('update:defaultReminder')?.[0]).toEqual(['Reminder'])
    expect(wrapper.find('.reminder-row').exists()).toBe(false)
    const switchButton = wrapper.find('.n-switch')
    await switchButton.trigger('click')
    expect(wrapper.emitted('update:remindersEnabled')?.[0]).toEqual([true])
    await wrapper.setProps({ remindersEnabled: true })
    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', undefined)
    await nextTick()
    const fallbackUpdate = getReminderEmits().slice(-1)[0]![0]
    expect(fallbackUpdate[0]).toMatchObject({ amount: 1 })
    expect(fallbackUpdate[1]).toMatchObject({ amount: 5, unit: 'hours', description: 'second' })
    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 30)
    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'hours')
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'Ping')
    const updates = getReminderEmits()
    expect(updates).toBeDefined()
    const lastUpdate = updates![updates!.length - 1]![0]
    expect(lastUpdate[0]).toMatchObject({ amount: 30, unit: 'hours', description: 'Ping' })
    expect(lastUpdate[1]).toMatchObject({ amount: 5, unit: 'hours', description: 'second' })
    const addButton = wrapper.findAll('button').find((button) => {
      return button.text().includes('Add reminder')
    })
    await addButton!.trigger('click')
    const addUpdate = getReminderEmits().slice(-1)[0]![0]
    expect(addUpdate).toHaveLength(3)
    const removeButton = wrapper.findAll('button').find((button) => {
      return button.text().includes('Remove')
    })
    await removeButton!.trigger('click')
    const removeUpdate = getReminderEmits().slice(-1)[0]![0]
    expect(removeUpdate).toHaveLength(2)
  })
})
