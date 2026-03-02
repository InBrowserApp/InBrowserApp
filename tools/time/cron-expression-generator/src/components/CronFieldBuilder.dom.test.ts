import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CronFieldBuilder from './CronFieldBuilder.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="n-card"><slot /><slot name="header" /></div>',
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
  mounted() {
    this.$emit('update:mode', this.mode)
  },
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
    this.$emit('update:rangeStart', 2)
    this.$emit('update:rangeEnd', 7)
  },
  template: '<div class="options-numeric" />',
})
const CronFieldOptionsMonthStub = defineComponent({
  name: 'CronFieldOptionsMonth',
  props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
  emits: ['update:specificValues', 'update:rangeStart', 'update:rangeEnd'],
  mounted() {
    this.$emit('update:specificValues', [1, 2])
    this.$emit('update:rangeStart', 2)
    this.$emit('update:rangeEnd', 4)
  },
  template: '<div class="options-month" />',
})
const CronFieldOptionsWeekdayStub = defineComponent({
  name: 'CronFieldOptionsWeekday',
  props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
  emits: ['update:specificValues', 'update:rangeStart', 'update:rangeEnd'],
  mounted() {
    this.$emit('update:specificValues', [1, 3, 5])
    this.$emit('update:rangeStart', 1)
    this.$emit('update:rangeEnd', 5)
  },
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
  it('applies specific weekday updates through v-model bindings', async () => {
    const wrapper = mountBuilder({
      fieldName: 'dayOfWeek',
      modelValue: '1,3',
    })
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['1,3,5'])
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
  it('uses month options for range mode', () => {
    const wrapper = mountBuilder({
      fieldName: 'month',
      modelValue: '2-4',
    })
    expect(wrapper.find('.options-month').exists()).toBe(true)
  })
  it('uses numeric options for range mode', () => {
    const wrapper = mountBuilder({
      fieldName: 'minute',
      modelValue: '2-4',
    })
    expect(wrapper.find('.options-numeric').exists()).toBe(true)
  })
  it('accepts specific updates while numeric range mode is active', async () => {
    const CronFieldOptionsNumericRangeStub = defineComponent({
      name: 'CronFieldOptionsNumeric',
      props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
      emits: ['update:specificValues', 'update:rangeStart', 'update:rangeEnd'],
      mounted() {
        this.$emit('update:specificValues', [8, 4])
        this.$emit('update:rangeStart', 4)
        this.$emit('update:rangeEnd', 8)
      },
      template: '<div class="options-numeric" />',
    })
    const wrapper = mount(CronFieldBuilder, {
      props: {
        fieldName: 'minute',
        modelValue: '2-4',
      },
      global: {
        stubs: {
          CronFieldHeader: CronFieldHeaderStub,
          CronFieldModeSelector: CronFieldModeSelectorStub,
          CronFieldEveryDescription: CronFieldEveryDescriptionStub,
          CronFieldIntervalControl: CronFieldIntervalControlStub,
          CronFieldOptionsNumeric: CronFieldOptionsNumericRangeStub,
          CronFieldOptionsMonth: CronFieldOptionsMonthStub,
          CronFieldOptionsWeekday: CronFieldOptionsWeekdayStub,
        },
      },
    })
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['4-8'])
  })
  it('emits wildcard when specific values are cleared', async () => {
    const CronFieldOptionsNumericEmptyStub = defineComponent({
      name: 'CronFieldOptionsNumeric',
      props: ['specificValues', 'rangeStart', 'rangeEnd', 'fieldConfig', 'mode'],
      emits: ['update:specificValues', 'update:rangeStart', 'update:rangeEnd'],
      mounted() {
        if (this.mode === 'specific') {
          this.$emit('update:specificValues', [])
        }
      },
      template: '<div class="options-numeric" />',
    })
    const wrapper = mount(CronFieldBuilder, {
      props: {
        fieldName: 'minute',
        modelValue: '1',
      },
      global: {
        stubs: {
          CronFieldHeader: CronFieldHeaderStub,
          CronFieldModeSelector: CronFieldModeSelectorStub,
          CronFieldEveryDescription: CronFieldEveryDescriptionStub,
          CronFieldIntervalControl: CronFieldIntervalControlStub,
          CronFieldOptionsNumeric: CronFieldOptionsNumericEmptyStub,
          CronFieldOptionsMonth: CronFieldOptionsMonthStub,
          CronFieldOptionsWeekday: CronFieldOptionsWeekdayStub,
        },
      },
    })
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['*'])
  })
  it('reacts to external model value changes', async () => {
    const wrapper = mountBuilder({
      fieldName: 'minute',
      modelValue: '*',
    })
    await wrapper.setProps({ modelValue: '*/15' })
    await nextTick()
    expect(wrapper.find('.interval-control').exists()).toBe(true)
  })
  it('falls back for unknown modes', async () => {
    const UnknownModeSelectorStub = defineComponent({
      name: 'CronFieldModeSelector',
      props: ['mode'],
      emits: ['update:mode'],
      mounted() {
        this.$emit('update:mode', 'custom')
      },
      template: '<div class="mode-selector" />',
    })
    const wrapper = mount(CronFieldBuilder, {
      props: {
        fieldName: 'minute',
        modelValue: '*',
      },
      global: {
        stubs: {
          CronFieldHeader: CronFieldHeaderStub,
          CronFieldModeSelector: UnknownModeSelectorStub,
          CronFieldEveryDescription: CronFieldEveryDescriptionStub,
          CronFieldIntervalControl: CronFieldIntervalControlStub,
          CronFieldOptionsNumeric: CronFieldOptionsNumericStub,
          CronFieldOptionsMonth: CronFieldOptionsMonthStub,
          CronFieldOptionsWeekday: CronFieldOptionsWeekdayStub,
        },
      },
    })
    await nextTick()
    expect(wrapper.find('.every-description').exists()).toBe(false)
  })
})
