import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChineseUppercaseNumberConverterView from './ChineseUppercaseNumberConverterView.vue'

const numberKey = 'tools:chinese-uppercase-number-converter:number'

const NumberInputStub = {
  name: 'NumberInput',
  props: ['value'],
  emits: ['update:value'],
  template: '<div class="number-input" />',
}

const ChineseUppercaseInputStub = {
  name: 'ChineseUppercaseInput',
  props: ['value'],
  emits: ['update:value'],
  template: '<div class="uppercase-input" />',
}

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  NumberInput: NumberInputStub,
  ChineseUppercaseInput: ChineseUppercaseInputStub,
  WhatIsChineseUppercaseNumber: {
    template: '<div class="what-is" />',
  },
}

describe('ChineseUppercaseNumberConverterView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the input sections', () => {
    const wrapper = mount(ChineseUppercaseNumberConverterView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.number-input').exists()).toBe(true)
    expect(wrapper.find('.uppercase-input').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('updates storage when number input emits', async () => {
    localStorage.setItem(numberKey, '12')
    const wrapper = mount(ChineseUppercaseNumberConverterView, {
      global: {
        stubs,
      },
    })

    const input = wrapper.findComponent({ name: 'NumberInput' })
    input.vm.$emit('update:value', '123.45')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(numberKey)).toBe('123.45')
  })

  it('updates storage when uppercase input emits', async () => {
    localStorage.setItem(numberKey, '12')
    const wrapper = mount(ChineseUppercaseNumberConverterView, {
      global: {
        stubs,
      },
    })

    const input = wrapper.findComponent({ name: 'ChineseUppercaseInput' })
    input.vm.$emit('update:value', '壹元整')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(numberKey)).toBe('1')
  })

  it('updates uppercase output when variant changes', async () => {
    localStorage.setItem(numberKey, '12')
    const wrapper = mount(ChineseUppercaseNumberConverterView, {
      global: {
        stubs,
      },
    })

    const vm = wrapper.vm as unknown as { uppercaseInput: string; variant: string }

    expect(vm.uppercaseInput).toBe('壹拾贰元整')
    vm.variant = 'traditional'
    await wrapper.vm.$nextTick()

    expect(vm.uppercaseInput).toBe('壹拾貳圓整')
  })
})
