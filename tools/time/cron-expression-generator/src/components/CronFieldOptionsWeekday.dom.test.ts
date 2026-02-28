import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldOptionsWeekday from './CronFieldOptionsWeekday.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
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
    NGrid: defineComponent({
      name: 'NGrid',
      props: ['cols', 'xGap', 'yGap'],
      template: '<div class="n-grid"><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options', 'size'],
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
  }
})

describe('CronFieldOptionsWeekday', () => {
  it('renders weekday labels for specific mode and emits updates', () => {
    const onUpdateSpecificValues = vi.fn()
    const wrapper = mount(CronFieldOptionsWeekday, {
      props: {
        fieldConfig: {
          gridCols: 7,
        },
        mode: 'specific',
        specificValues: [],
        rangeStart: 0,
        rangeEnd: 6,
        'onUpdate:specificValues': onUpdateSpecificValues,
      },
    })

    const checkboxes = wrapper.findAll('.n-checkbox')
    expect(checkboxes).toHaveLength(7)
    expect(checkboxes[0]?.text()).toContain('Sun')

    wrapper.findComponent({ name: 'NCheckboxGroup' }).vm.$emit('update:value', [1, 3, 5])
    expect(onUpdateSpecificValues).toHaveBeenCalledWith([1, 3, 5])
  })

  it('renders range selects for range mode and emits start/end updates', () => {
    const onUpdateRangeStart = vi.fn()
    const onUpdateRangeEnd = vi.fn()
    const wrapper = mount(CronFieldOptionsWeekday, {
      props: {
        fieldConfig: {
          gridCols: 7,
        },
        mode: 'range',
        specificValues: [],
        rangeStart: 1,
        rangeEnd: 5,
        'onUpdate:rangeStart': onUpdateRangeStart,
        'onUpdate:rangeEnd': onUpdateRangeEnd,
      },
    })

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    expect(wrapper.text()).toContain('From')
    expect(wrapper.text()).toContain('to')

    selects[0]?.vm.$emit('update:value', 2)
    selects[1]?.vm.$emit('update:value', 6)
    expect(onUpdateRangeStart).toHaveBeenCalledWith(2)
    expect(onUpdateRangeEnd).toHaveBeenCalledWith(6)
  })
})
