import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, onMounted } from 'vue'

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h3><slot /></h3>',
})

const SettingsStub = defineComponent({
  name: 'IcalEventDateTimeSettingsSection',
  emits: ['update:is-all-day', 'update:time-zone', 'update:output-mode'],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:is-all-day', true)
      emit('update:time-zone', 'Asia/Tokyo')
      emit('update:output-mode', 'tzid')
    })
    return () => h('div', { 'data-testid': 'settings' })
  },
})

const RangeStub = defineComponent({
  name: 'IcalEventDateTimeRangeSection',
  emits: ['update:date-range'],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:date-range', [1000, 2000])
    })
    return () => h('div', { 'data-testid': 'range' })
  },
})

describe('IcalEventDateTimeSection', () => {
  it('emits updates from child sections', async () => {
    const { default: IcalEventDateTimeSection } = await import('./IcalEventDateTimeSection.vue')

    const wrapper = mount(IcalEventDateTimeSection, {
      props: {
        isAllDay: false,
        timeZone: 'UTC',
        outputMode: 'utc',
        dateRange: [0, 1],
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
        offsetLabel: 'UTC+0',
        rangeErrorKey: 'invalid-date',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          IcalEventDateTimeSettingsSection: SettingsStub,
          IcalEventDateTimeRangeSection: RangeStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Date & time')
    expect(wrapper.emitted('update:isAllDay')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:timeZone')?.[0]).toEqual(['Asia/Tokyo'])
    expect(wrapper.emitted('update:outputMode')?.[0]).toEqual(['tzid'])
    expect(wrapper.emitted('update:dateRange')?.[0]).toEqual([[1000, 2000]])
  })
})
