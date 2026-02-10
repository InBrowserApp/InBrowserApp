import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CIDRsInput from './CIDRsInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NForm = defineComponent({
    name: 'NForm',
    props: {
      model: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(_, { slots }) {
      return () => h('form', { class: 'n-form' }, slots.default?.())
    },
  })

  const NDynamicInput = defineComponent({
    name: 'NDynamicInput',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      placeholder: {
        type: String,
        default: '',
      },
      onCreate: {
        type: Function,
        default: undefined,
      },
      itemStyle: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { slots }) {
      return () =>
        h('div', { class: 'dynamic-input', 'data-placeholder': props.placeholder }, [
          slots['create-button-default']?.(),
          slots.default?.({ index: 0 }),
        ])
    },
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      path: {
        type: String,
        default: '',
      },
      rule: {
        type: Object,
        default: () => ({}),
      },
      showLabel: {
        type: Boolean,
        default: true,
      },
      ignorePathChange: {
        type: Boolean,
        default: false,
      },
    },
    setup(_, { slots }) {
      return () => h('div', { class: 'form-item' }, slots.default?.())
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('input', {
          class: 'input',
          value: props.value,
          placeholder: props.placeholder,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  return {
    NForm,
    NDynamicInput,
    NFormItem,
    NInput,
  }
})

const mountCIDRsInput = () =>
  mount(CIDRsInput, {
    props: {
      cidrs: [],
    },
  })

const getLastCidrsEvent = (wrapper: ReturnType<typeof mountCIDRsInput>) => {
  const events = wrapper.emitted('update:cidrs') ?? []
  const lastEvent = events[events.length - 1]
  if (!lastEvent) {
    throw new Error('Expected update:cidrs emission')
  }
  return lastEvent
}

describe('CIDRsInput', () => {
  it('renders placeholders and the add button label', () => {
    const wrapper = mountCIDRsInput()

    expect(wrapper.find('.dynamic-input').attributes('data-placeholder')).toBe('placeholder')
    expect(wrapper.text()).toContain('addCidr')
    expect(wrapper.find('input').attributes('placeholder')).toBe('placeholder')
  })

  it('emits cidrs updates for valid and invalid list inputs', async () => {
    const wrapper = mountCIDRsInput()
    const dynamicInput = wrapper.findComponent({ name: 'NDynamicInput' })

    dynamicInput.vm.$emit('update:value', ['10.0.0.0/24'])
    await nextTick()
    expect(getLastCidrsEvent(wrapper)).toEqual([['10.0.0.0/24']])

    dynamicInput.vm.$emit('update:value', ['not-a-cidr'])
    await nextTick()
    expect(getLastCidrsEvent(wrapper)).toEqual([undefined])
  })

  it('handles input editing, create callback, and validation rule branches', async () => {
    const wrapper = mountCIDRsInput()

    await wrapper.find('input').setValue('10.0.0.0/24')
    await nextTick()
    expect(getLastCidrsEvent(wrapper)).toEqual([['10.0.0.0/24']])

    const dynamicInput = wrapper.findComponent({ name: 'NDynamicInput' })
    const onCreate = dynamicInput.props('onCreate') as (() => string) | undefined
    expect(onCreate?.()).toBe('')

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    const rule = formItem.props('rule') as {
      validator: (rule: unknown, value: string) => Error | undefined
    }

    expect(rule.validator({}, 'not-a-cidr')).toBeInstanceOf(Error)
    expect(rule.validator({}, '10.0.0.0/24')).toBeUndefined()
  })
})
