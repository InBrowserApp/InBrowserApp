import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IPRangeInput from './IPRangeInput.vue'

type ParsedIp = { version: number; number: number }

type Range = [string, string]

const ipData = new Map<string, ParsedIp>([
  ['10.0.0.1', { version: 4, number: 1 }],
  ['10.0.0.2', { version: 4, number: 2 }],
  ['10.0.0.10', { version: 4, number: 10 }],
  ['2001:db8::1', { version: 6, number: 1 }],
])

vi.mock('is-ip', () => ({
  isIP: (value: string) => ipData.has(value),
}))

vi.mock('ip-bigint', () => ({
  parseIp: (value: string) => ipData.get(value) ?? { version: 4, number: -1 },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, computed } = await import('vue')

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: [String, Array],
        default: '',
      },
      placeholder: {
        type: [String, Array],
        default: '',
      },
      pair: {
        type: Boolean,
        default: false,
      },
      separator: {
        type: String,
        default: '',
      },
      clearable: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      const normalizedValue = computed(() =>
        Array.isArray(props.value) ? props.value : [props.value, ''],
      )
      const normalizedPlaceholder = computed(() =>
        Array.isArray(props.placeholder) ? props.placeholder : [props.placeholder, ''],
      )

      const update = (index: number, event: Event) => {
        const next = [...normalizedValue.value] as Range
        next[index] = (event.target as HTMLInputElement).value
        emit('update:value', next)
      }

      return {
        normalizedValue,
        normalizedPlaceholder,
        update,
      }
    },
    template: `
      <div class="n-input">
        <input
          class="start"
          :value="normalizedValue[0]"
          :placeholder="normalizedPlaceholder[0]"
          @input="update(0, $event)"
        />
        <input
          class="end"
          :value="normalizedValue[1]"
          :placeholder="normalizedPlaceholder[1]"
          @input="update(1, $event)"
        />
      </div>
    `,
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: ['label', 'rule', 'showLabel'],
    template: '<div class="form-item"><slot /></div>',
  })

  return {
    NInput,
    NFormItem,
  }
})

const updateRange = async (wrapper: ReturnType<typeof mount>, range: Range) => {
  wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', range)
  await nextTick()
}

describe('IPRangeInput', () => {
  it('emits the range for valid input', async () => {
    const wrapper = mount(IPRangeInput)

    await updateRange(wrapper, ['10.0.0.1', '10.0.0.2'])

    const events = wrapper.emitted('update:ipRange') ?? []
    expect(events[events.length - 1]).toEqual([['10.0.0.1', '10.0.0.2']])
    expect(wrapper.findComponent({ name: 'NInput' }).props('placeholder')).toEqual([
      'startIP',
      'endIP',
    ])
  })

  it('clears the model for reversed ranges', async () => {
    const wrapper = mount(IPRangeInput)

    await updateRange(wrapper, ['10.0.0.10', '10.0.0.2'])

    const events = wrapper.emitted('update:ipRange') ?? []
    expect(events[events.length - 1]).toEqual([['', '']])
  })

  it('validates range values with specific errors', async () => {
    const wrapper = mount(IPRangeInput)

    const rule = wrapper.findComponent({ name: 'NFormItem' }).props('rule') as {
      validator: () => Error | undefined
    }

    const cases: Array<{ range: Range; message: string }> = [
      { range: ['bad', 'bad'], message: 'invalidIPRange' },
      { range: ['bad', '10.0.0.2'], message: 'invalidStartIP' },
      { range: ['10.0.0.2', 'bad'], message: 'invalidEndIP' },
      { range: ['10.0.0.2', '2001:db8::1'], message: 'ipVersionMismatch' },
      { range: ['10.0.0.10', '10.0.0.2'], message: 'startIPMustBeSmaller' },
    ]

    for (const { range, message } of cases) {
      await updateRange(wrapper, range)
      const error = rule.validator()
      expect(error).toBeInstanceOf(Error)
      expect(error?.message).toBe(message)
    }

    await updateRange(wrapper, ['10.0.0.1', '10.0.0.2'])
    expect(rule.validator()).toBeUndefined()
  })
})
