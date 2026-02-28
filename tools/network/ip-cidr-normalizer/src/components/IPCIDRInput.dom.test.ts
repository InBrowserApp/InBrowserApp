import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import IPCIDRInput from './IPCIDRInput.vue'

const NInputStub = defineComponent({
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
  template:
    '<input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
})

let capturedRule: unknown

const NFormItemStub = defineComponent({
  name: 'NFormItem',
  props: ['label', 'rule', 'showLabel'],
  setup(props, { slots }) {
    capturedRule = props.rule

    return () => h('div', { class: 'form-item' }, slots.default ? slots.default() : [])
  },
})

const stubs = {
  NInput: NInputStub,
  NFormItem: NFormItemStub,
  FormItem: NFormItemStub,
  'n-input': NInputStub,
  'n-form-item': NFormItemStub,
}

describe('IPCIDRInput', () => {
  it('emits updates for valid IP input', async () => {
    const wrapper = mount(IPCIDRInput, {
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('192.168.0.1')

    const events = wrapper.emitted('update:ipcidr')
    expect(events?.[0]).toEqual(['192.168.0.1'])
  })

  it('falls back to an empty input when model starts as null', () => {
    const wrapper = mount(IPCIDRInput, {
      props: {
        ipcidr: null as unknown as string,
      },
      global: {
        stubs,
      },
    })

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('clears the model for invalid input', async () => {
    const wrapper = mount(IPCIDRInput, {
      props: {
        ipcidr: '10.0.0.1',
      },
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('999')

    const events = wrapper.emitted('update:ipcidr')
    expect(events).toBeTruthy()
    expect(events?.[events.length - 1]).toEqual([''])
  })

  it('passes validation for valid cidr input', async () => {
    capturedRule = undefined
    const wrapper = mount(IPCIDRInput, {
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('10.0.0.1/24')

    const rule = capturedRule as { validator?: () => Error | undefined } | undefined
    if (typeof rule?.validator !== 'function') {
      throw new Error('Expected validation rule to be captured')
    }

    const result = rule.validator()
    expect(result).toBeUndefined()
  })

  it('returns a validation error for invalid non-cidr input', async () => {
    capturedRule = undefined
    const wrapper = mount(IPCIDRInput, {
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('not-an-ip')

    const rule = capturedRule as { validator?: () => Error | undefined } | undefined
    if (typeof rule?.validator !== 'function') {
      throw new Error('Expected validation rule to be captured')
    }

    const result = rule.validator()
    expect(result).toBeInstanceOf(Error)
    expect(result?.message).toBe('Invalid IP/CIDR')
  })
})
