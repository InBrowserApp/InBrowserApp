import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { NInput, NInputNumber } from 'naive-ui'
import URLComponents from './URLComponents.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  return {
    NGrid: makeStub('NGrid'),
    NGridItem: makeStub('NGridItem'),
    NFormItem,
    NInput,
    NInputNumber,
  }
})

const mountComponents = (url: string) =>
  mount(URLComponents, {
    props: { url },
  })

describe('URLComponents', () => {
  it('syncs child inputs when url changes', async () => {
    const wrapper = mountComponents('https://user:pass@example.com:8080/path?query=1#hash')
    const inputs = wrapper.findAllComponents(NInput)
    const portInput = wrapper.findComponent(NInputNumber)

    expect(inputs).toHaveLength(7)
    expect(inputs[0]?.props('value')).toBe('https')
    expect(inputs[1]?.props('value')).toBe('user')
    expect(inputs[2]?.props('value')).toBe('pass')
    expect(inputs[3]?.props('value')).toBe('example.com')
    expect(portInput.props('value')).toBe(8080)
    expect(inputs[4]?.props('value')).toBe('/path')
    expect(inputs[5]?.props('value')).toBe('?query=1')
    expect(inputs[6]?.props('value')).toBe('#hash')

    await wrapper.setProps({ url: 'http://demo.test:9090/new-path?next=2#part' })
    await nextTick()

    const updatedInputs = wrapper.findAllComponents(NInput)
    const updatedPort = wrapper.findComponent(NInputNumber)

    expect(updatedInputs[0]?.props('value')).toBe('http:')
    expect(updatedInputs[1]?.props('value')).toBe('')
    expect(updatedInputs[2]?.props('value')).toBe('')
    expect(updatedInputs[3]?.props('value')).toBe('demo.test')
    expect(updatedPort.props('value')).toBe(9090)
    expect(updatedInputs[4]?.props('value')).toBe('/new-path')
    expect(updatedInputs[5]?.props('value')).toBe('?next=2')
    expect(updatedInputs[6]?.props('value')).toBe('#part')
  })

  it('emits url updates when parts change', async () => {
    const wrapper = mountComponents('https://user:pass@example.com:8080/path?param=1#hash')
    const inputs = wrapper.findAllComponents(NInput)
    const portInput = wrapper.findComponent(NInputNumber)

    const getLastUrl = () => {
      const emitted = wrapper.emitted('update:url') ?? []
      return emitted.length ? emitted[emitted.length - 1]?.[0] : undefined
    }

    await inputs[0]?.vm.$emit('update:value', 'http')
    await nextTick()
    expect(getLastUrl()).toMatch(/^http:\/\//)

    await inputs[1]?.vm.$emit('update:value', 'alice')
    await nextTick()
    expect(getLastUrl()).toContain('alice:')

    await inputs[2]?.vm.$emit('update:value', 'secret')
    await nextTick()
    expect(getLastUrl()).toContain('alice:secret@')

    await inputs[3]?.vm.$emit('update:value', 'example.org')
    await nextTick()
    expect(getLastUrl()).toContain('example.org')

    await portInput.vm.$emit('update:value', 9090)
    await nextTick()
    expect(getLastUrl()).toContain(':9090')

    await inputs[4]?.vm.$emit('update:value', '/docs')
    await nextTick()
    expect(getLastUrl()).toContain('/docs')

    await inputs[5]?.vm.$emit('update:value', '?next=1')
    await nextTick()
    expect(getLastUrl()).toContain('?next=1')

    await inputs[6]?.vm.$emit('update:value', '#section')
    await nextTick()
    expect(getLastUrl()).toContain('#section')
  })
})
