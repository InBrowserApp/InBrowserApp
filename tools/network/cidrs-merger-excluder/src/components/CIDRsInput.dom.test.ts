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

describe('CIDRsInput', () => {
  it('renders placeholders and the add button label', () => {
    const wrapper = mount(CIDRsInput, {
      props: {
        cidrs: [],
      },
    })

    expect(wrapper.find('.dynamic-input').attributes('data-placeholder')).toBe('placeholder')
    expect(wrapper.text()).toContain('addCidr')
    expect(wrapper.find('input').attributes('placeholder')).toBe('placeholder')
  })

  it('emits cidrs updates for valid and invalid inputs', async () => {
    const wrapper = mount(CIDRsInput, {
      props: {
        cidrs: [],
      },
    })

    const dynamicInput = wrapper.findComponent({ name: 'NDynamicInput' })
    dynamicInput.vm.$emit('update:value', ['10.0.0.0/24'])
    await nextTick()

    let events = wrapper.emitted('update:cidrs') ?? []
    let lastEvent = events[events.length - 1]
    if (!lastEvent) {
      throw new Error('Expected update:cidrs emission for valid input')
    }
    expect(lastEvent).toEqual([['10.0.0.0/24']])

    dynamicInput.vm.$emit('update:value', ['not-a-cidr'])
    await nextTick()

    events = wrapper.emitted('update:cidrs') ?? []
    lastEvent = events[events.length - 1]
    if (!lastEvent) {
      throw new Error('Expected update:cidrs emission for invalid input')
    }
    expect(lastEvent).toEqual([undefined])
  })
})
