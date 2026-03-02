import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldOptionsNumeric from './CronFieldOptionsNumeric.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NCheckboxGroup: defineComponent({
      name: 'NCheckboxGroup',
      props: ['value'],
      emits: ['update:value'],
      template: '<div class="n-checkbox-group"><slot /></div>',
    }),
    NCheckbox: defineComponent({
      name: 'NCheckbox',
      props: ['value', 'size'],
      template: '<label class="n-checkbox"><slot /></label>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options', 'size'],
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
  }
})
describe('CronFieldOptionsNumeric', () => {
  it('renders numeric checkboxes for specific mode and emits updates', () => {
    const onUpdateSpecificValues = vi.fn()
    const wrapper = mount(CronFieldOptionsNumeric, {
      props: {
        fieldConfig: {
          min: 1,
          max: 3,
          gridCols: 3,
        },
        mode: 'specific',
        specificValues: [1],
        rangeStart: 1,
        rangeEnd: 3,
        'onUpdate:specificValues': onUpdateSpecificValues,
      },
    })
    expect(wrapper.findAll('.n-checkbox')).toHaveLength(3)
    wrapper.findComponent({ name: 'NCheckboxGroup' }).vm.$emit('update:value', [2, 3])
    expect(onUpdateSpecificValues).toHaveBeenCalledWith([2, 3])
  })
  it('renders range selects for range mode and emits start/end updates', () => {
    const onUpdateRangeStart = vi.fn()
    const onUpdateRangeEnd = vi.fn()
    const wrapper = mount(CronFieldOptionsNumeric, {
      props: {
        fieldConfig: {
          min: 1,
          max: 3,
          gridCols: 3,
        },
        mode: 'range',
        specificValues: [],
        rangeStart: 1,
        rangeEnd: 3,
        'onUpdate:rangeStart': onUpdateRangeStart,
        'onUpdate:rangeEnd': onUpdateRangeEnd,
      },
    })
    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    expect(selects[0]?.props('options')).toHaveLength(3)
    selects[0]?.vm.$emit('update:value', 2)
    selects[1]?.vm.$emit('update:value', 2)
    expect(onUpdateRangeStart).toHaveBeenCalledWith(2)
    expect(onUpdateRangeEnd).toHaveBeenCalledWith(2)
  })
})
