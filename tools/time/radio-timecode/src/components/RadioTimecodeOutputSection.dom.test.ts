import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        value: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template:
        '<input data-testid="offset" :value="value" @input="$emit(\'update:value\', $event.target.value === \'\' ? null : Number($event.target.value))" />',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      props: {
        value: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template:
        '<input data-testid="volume" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span data-testid="text"><slot /></span>',
    }),
  }
})

import RadioTimecodeOutputSection from './RadioTimecodeOutputSection.vue'

describe('RadioTimecodeOutputSection', () => {
  it('emits volume and offset updates', async () => {
    const wrapper = mount(RadioTimecodeOutputSection, {
      props: {
        volume: 0.4,
        offsetMs: 10,
        carrierHz: 77500,
        baseHz: 4000,
      },
    })

    await wrapper.get('[data-testid="volume"]').setValue('0.85')
    expect(wrapper.emitted('update:volume')?.[0]).toEqual([0.85])

    await wrapper.get('[data-testid="offset"]').setValue('')
    expect(wrapper.emitted('update:offsetMs')?.[0]).toEqual([0])

    const text = wrapper.text()
    const placeholderTexts = wrapper
      .findAll('[data-testid="text"]')
      .map((node) => node.text())
      .filter((value) => value === '-')

    expect(text).toContain('Hz')
    expect(placeholderTexts).toHaveLength(0)
  })

  it('renders placeholders when carrier and base are missing', () => {
    const wrapper = mount(RadioTimecodeOutputSection, {
      props: {
        volume: 0.4,
        offsetMs: 0,
      },
    })

    const placeholderTexts = wrapper
      .findAll('[data-testid="text"]')
      .map((node) => node.text())
      .filter((value) => value === '-')

    expect(placeholderTexts).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Hz')
  })
})
