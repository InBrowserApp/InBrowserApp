import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CronFieldBuilder from './CronFieldBuilder.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="n-card"><slot /><slot name="header" /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
  }
})

const CronFieldHeaderStub = defineComponent({
  name: 'CronFieldHeader',
  props: ['fieldName'],
  template: '<div class="field-header" :data-name="fieldName" />',
})

const CronFieldModeSelectorStub = defineComponent({
  name: 'CronFieldModeSelector',
  props: ['mode'],
  emits: ['update:mode'],
  template: '<div class="mode-selector" />',
})

const CronFieldEveryDescriptionStub = defineComponent({
  name: 'CronFieldEveryDescription',
  props: ['fieldName'],
  template: '<div class="every-description" />',
})

const CronFieldIntervalControlStub = defineComponent({
  name: 'CronFieldIntervalControl',
  props: ['intervalValue', 'fieldConfig'],
  emits: ['update:intervalValue'],
  mounted() {
    this.$emit('update:intervalValue', 10)
  },
  template: '<div class="interval-control" />',
})

const CronFieldOptionsNumericStub = defineComponent({
  name: 'CronFieldOptionsNumeric',
  props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
  emits: ['update:specificValues', 'update:rangeStart', 'update:rangeEnd'],
  mounted() {
    if (this.mode === 'specific') {
      this.$emit('update:specificValues', [5, 1, 3])
    }
  },
  template: '<div class="options-numeric" />',
})

const CronFieldOptionsMonthStub = defineComponent({
  name: 'CronFieldOptionsMonth',
  props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
  template: '<div class="options-month" />',
})

const CronFieldOptionsWeekdayStub = defineComponent({
  name: 'CronFieldOptionsWeekday',
  props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
  template: '<div class="options-weekday" />',
})

type FieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

const mountBuilder = (props: { fieldName: FieldName; modelValue: string }) =>
  mount(CronFieldBuilder, {
    props,
    global: {
      stubs: {
        CronFieldHeader: CronFieldHeaderStub,
        CronFieldModeSelector: CronFieldModeSelectorStub,
        CronFieldEveryDescription: CronFieldEveryDescriptionStub,
        CronFieldIntervalControl: CronFieldIntervalControlStub,
        CronFieldOptionsNumeric: CronFieldOptionsNumericStub,
        CronFieldOptionsMonth: CronFieldOptionsMonthStub,
        CronFieldOptionsWeekday: CronFieldOptionsWeekdayStub,
      },
    },
  })

describe('CronFieldBuilder', () => {
  it('renders every description for wildcard values', () => {
    const wrapper = mountBuilder({
      fieldName: 'minute',
      modelValue: '*',
    })

    expect(wrapper.find('.every-description').exists()).toBe(true)
  })

  it('emits interval updates for interval values', async () => {
    const wrapper = mountBuilder({
      fieldName: 'minute',
      modelValue: '*/5',
    })

    await nextTick()
    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['*/10'])
  })

  it('uses month options for month fields', () => {
    const wrapper = mountBuilder({
      fieldName: 'month',
      modelValue: '1,2',
    })

    expect(wrapper.find('.options-month').exists()).toBe(true)
  })

  it('uses weekday options for weekday fields', () => {
    const wrapper = mountBuilder({
      fieldName: 'dayOfWeek',
      modelValue: '1-5',
    })

    expect(wrapper.find('.options-weekday').exists()).toBe(true)
  })

  it('sorts numeric specific values', async () => {
    const wrapper = mountBuilder({
      fieldName: 'minute',
      modelValue: '5,1',
    })

    await nextTick()
    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['1,3,5'])
  })
})
