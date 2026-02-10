import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import RomanNumeralConverterView from './RomanNumeralConverterView.vue'
import * as toolInfo from './info'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: number) => ref(initialValue),
  }
})

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ArabicInputStub = defineComponent({
  name: 'ArabicNumberInput',
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:value'],
  template:
    '<div data-testid="arabic" :data-value="value"><button data-testid="arabic-set" @click="$emit(\'update:value\', 4)" /></div>',
})

const RomanInputStub = defineComponent({
  name: 'RomanNumeralInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template:
    '<div data-testid="roman" :data-value="value"><button data-testid="roman-set" @click="$emit(\'update:value\', \'X\')" /></div>',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsRomanNumeral',
  template: '<div data-testid="what-is" />',
})

describe('RomanNumeralConverterView', () => {
  const stubs = {
    ToolDefaultPageLayout: LayoutStub,
    ArabicNumberInput: ArabicInputStub,
    RomanNumeralInput: RomanInputStub,
    WhatIsRomanNumeral: WhatIsStub,
  }

  it('renders the layout and initial values', () => {
    const wrapper = mount(RomanNumeralConverterView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.get('[data-testid="arabic"]').attributes('data-value')).toBe('1')
    expect(wrapper.get('[data-testid="roman"]').attributes('data-value')).toBe('I')
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })

  it('updates roman when arabic changes', async () => {
    const wrapper = mount(RomanNumeralConverterView, {
      global: {
        stubs,
      },
    })

    await wrapper.get('[data-testid="arabic-set"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="roman"]').attributes('data-value')).toBe('IV')
  })

  it('updates arabic when roman changes', async () => {
    const wrapper = mount(RomanNumeralConverterView, {
      global: {
        stubs,
      },
    })

    await wrapper.get('[data-testid="roman-set"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="arabic"]').attributes('data-value')).toBe('10')
  })
})
