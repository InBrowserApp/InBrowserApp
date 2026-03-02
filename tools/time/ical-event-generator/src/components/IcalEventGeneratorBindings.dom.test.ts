import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, onMounted, ref, type Ref } from 'vue'
type Reminder = {
  amount: number
  unit: string
  description: string
}
type IcalState = {
  timeZoneOptions: Ref<
    Array<{
      label: string
      value: string
    }>
  >
  title: Ref<string>
  location: Ref<string>
  description: Ref<string>
  url: Ref<string>
  uid: Ref<string>
  regenerateUid: () => void
  isAllDay: Ref<boolean>
  timeZone: Ref<string>
  outputMode: Ref<'utc' | 'tzid'>
  dateRange: Ref<[number, number] | null>
  offsetLabel: Ref<string>
  rangeErrorKey: Ref<string | null>
  recurrenceFrequency: Ref<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>
  recurrenceInterval: Ref<number>
  recurrenceWeekdays: Ref<string[]>
  recurrenceMonthDay: Ref<number>
  recurrenceMonth: Ref<number>
  recurrenceEndMode: Ref<'never' | 'count' | 'until'>
  recurrenceCount: Ref<number>
  recurrenceUntilInput: Ref<string>
  recurrenceUntilStatus: Ref<'error' | 'success' | undefined>
  recurrenceUntilErrorKey: Ref<string | null>
  remindersEnabled: Ref<boolean>
  reminders: Ref<Reminder[]>
  reminderDefault: Ref<Reminder>
  icsContent: Ref<string>
  icsHref: Ref<string>
  outputErrorKey: Ref<string | null>
}
const { getState, setState } = vi.hoisted(() => {
  let state: IcalState | null = null
  return {
    getState: () => state as IcalState,
    setState: (next: IcalState) => {
      state = next
    },
  }
})
const buildState = (): IcalState => ({
  timeZoneOptions: ref([{ label: 'UTC', value: 'UTC' }]),
  title: ref(''),
  location: ref(''),
  description: ref(''),
  url: ref(''),
  uid: ref(''),
  regenerateUid: vi.fn(),
  isAllDay: ref(false),
  timeZone: ref('UTC'),
  outputMode: ref('utc'),
  dateRange: ref([100, 200]),
  offsetLabel: ref('UTC+0'),
  rangeErrorKey: ref(null),
  recurrenceFrequency: ref('none'),
  recurrenceInterval: ref(1),
  recurrenceWeekdays: ref([]),
  recurrenceMonthDay: ref(1),
  recurrenceMonth: ref(1),
  recurrenceEndMode: ref('never'),
  recurrenceCount: ref(1),
  recurrenceUntilInput: ref(''),
  recurrenceUntilStatus: ref(undefined),
  recurrenceUntilErrorKey: ref(null),
  remindersEnabled: ref(false),
  reminders: ref([{ amount: 15, unit: 'minutes', description: '' }]),
  reminderDefault: ref({ amount: 10, unit: 'minutes', description: '' }),
  icsContent: ref(''),
  icsHref: ref(''),
  outputErrorKey: ref(null),
})
vi.mock('../composables/useIcalEventGenerator', () => ({
  useIcalEventGenerator: () => getState(),
}))
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
  }
})
const DetailsStub = defineComponent({
  name: 'IcalEventDetailsSection',
  emits: [
    'update:title',
    'update:location',
    'update:description',
    'update:url',
    'update:uid',
    'regenerate-uid',
  ],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:title', 'Updated title')
      emit('update:location', 'Updated location')
      emit('update:description', 'Updated description')
      emit('update:url', 'https://updated.example')
      emit('update:uid', 'updated@example.com')
      emit('regenerate-uid')
    })
    return () => h('div', { 'data-testid': 'details' })
  },
})
const DateTimeStub = defineComponent({
  name: 'IcalEventDateTimeSection',
  emits: ['update:is-all-day', 'update:time-zone', 'update:output-mode', 'update:date-range'],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:is-all-day', true)
      emit('update:time-zone', 'Asia/Tokyo')
      emit('update:output-mode', 'tzid')
      emit('update:date-range', [1000, 2000])
    })
    return () => h('div', { 'data-testid': 'date-time' })
  },
})
const RecurrenceStub = defineComponent({
  name: 'IcalEventRecurrenceSection',
  emits: [
    'update:recurrence-frequency',
    'update:recurrence-interval',
    'update:recurrence-weekdays',
    'update:recurrence-month-day',
    'update:recurrence-month',
    'update:recurrence-end-mode',
    'update:recurrence-count',
    'update:recurrence-until-input',
  ],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:recurrence-frequency', 'weekly')
      emit('update:recurrence-interval', 2)
      emit('update:recurrence-weekdays', ['MO', 'WE'])
      emit('update:recurrence-month-day', 15)
      emit('update:recurrence-month', 6)
      emit('update:recurrence-end-mode', 'count')
      emit('update:recurrence-count', 4)
      emit('update:recurrence-until-input', '2024-06-01')
    })
    return () => h('div', { 'data-testid': 'recurrence' })
  },
})
const RemindersStub = defineComponent({
  name: 'IcalEventRemindersSection',
  emits: ['update:reminders-enabled', 'update:reminders', 'update:default-reminder'],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:reminders-enabled', true)
      emit('update:reminders', [{ amount: 5, unit: 'minutes', description: 'Reminder' }])
      emit('update:default-reminder', { amount: 10, unit: 'minutes', description: '' })
    })
    return () => h('div', { 'data-testid': 'reminders' })
  },
})
const OutputStub = defineComponent({
  name: 'IcalEventOutputSection',
  props: {
    icsContent: {
      type: String,
      default: '',
    },
    icsHref: {
      type: String,
      default: '',
    },
    outputErrorKey: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'output',
        'data-content': props.icsContent,
        'data-href': props.icsHref,
        'data-error': props.outputErrorKey ?? '',
      })
  },
})
const QrCodeStub = defineComponent({
  name: 'IcalEventQrCodeSection',
  props: {
    text: {
      type: String,
      default: '',
    },
    qrOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => h('div', { 'data-testid': 'qrcode', 'data-text': props.text })
  },
})
describe('IcalEventGenerator bindings', () => {
  beforeEach(() => {
    setState(buildState())
    vi.resetModules()
  })
  it('wires v-model updates and uses QR fallback text', async () => {
    const { default: IcalEventGenerator } = await import('./IcalEventGenerator.vue')
    const wrapper = mount(IcalEventGenerator, {
      global: {
        stubs: {
          IcalEventDetailsSection: DetailsStub,
          IcalEventDateTimeSection: DateTimeStub,
          IcalEventRecurrenceSection: RecurrenceStub,
          IcalEventRemindersSection: RemindersStub,
          IcalEventOutputSection: OutputStub,
          IcalEventQrCodeSection: QrCodeStub,
        },
      },
    })
    await flushPromises()
    const state = getState()
    expect(state.title.value).toBe('Updated title')
    expect(state.location.value).toBe('Updated location')
    expect(state.description.value).toBe('Updated description')
    expect(state.url.value).toBe('https://updated.example')
    expect(state.uid.value).toBe('updated@example.com')
    expect(state.isAllDay.value).toBe(true)
    expect(state.timeZone.value).toBe('Asia/Tokyo')
    expect(state.outputMode.value).toBe('tzid')
    expect(state.dateRange.value).toEqual([1000, 2000])
    expect(state.recurrenceFrequency.value).toBe('weekly')
    expect(state.recurrenceInterval.value).toBe(2)
    expect(state.recurrenceWeekdays.value).toEqual(['MO', 'WE'])
    expect(state.recurrenceMonthDay.value).toBe(15)
    expect(state.recurrenceMonth.value).toBe(6)
    expect(state.recurrenceEndMode.value).toBe('count')
    expect(state.recurrenceCount.value).toBe(4)
    expect(state.recurrenceUntilInput.value).toBe('2024-06-01')
    expect(state.remindersEnabled.value).toBe(true)
    expect(state.reminders.value).toEqual([{ amount: 5, unit: 'minutes', description: 'Reminder' }])
    expect(state.reminderDefault.value).toEqual({ amount: 10, unit: 'minutes', description: '' })
    expect(state.regenerateUid).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-testid="qrcode"]').attributes('data-text')).toBe(' ')
  })
})
