import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KeyOptions from './KeyOptions.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: {
      label: {
        type: String,
        default: '',
      },
      span: {
        type: Number,
        default: 1,
      },
    },
    template: '<div class="form-item" :data-label="label" :data-span="span"><slot /></div>',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    emits: ['update:value'],
    template: '<div class="radio-group"><slot /></div>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="select" />',
  })

  const NInput = defineComponent({
    name: 'NInput',
    emits: ['update:value'],
    template: '<input class="input" />',
  })

  return {
    NGrid: Base,
    NFormItemGi,
    NRadioGroup,
    NRadio: Base,
    NSpace: Base,
    NSelect,
    NInput,
    NTag: Base,
  }
})

describe('KeyOptions', () => {
  it('hides the key size selector for ed25519', () => {
    const wrapper = mount(KeyOptions, {
      props: {
        algorithm: 'ed25519',
        rsaKeySize: 4096,
        comment: '',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(false)
  })

  it('shows key size options for RSA', () => {
    const wrapper = mount(KeyOptions, {
      props: {
        algorithm: 'rsa',
        rsaKeySize: 4096,
        comment: '',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
        },
      },
    })

    const select = wrapper.getComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: number }>
    expect(options.map((option) => option.label)).toContain('4096 bits (Recommended)')
  })

  it('emits updates from form controls', async () => {
    const wrapper = mount(KeyOptions, {
      props: {
        algorithm: 'rsa',
        rsaKeySize: 4096,
        comment: '',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
        },
      },
    })

    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 2048)
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'alice')
    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'ed25519')
    await nextTick()

    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['ed25519'])
    expect(wrapper.emitted('update:rsaKeySize')?.[0]).toEqual([2048])
    expect(wrapper.emitted('update:comment')?.[0]).toEqual(['alice'])
  })
})
