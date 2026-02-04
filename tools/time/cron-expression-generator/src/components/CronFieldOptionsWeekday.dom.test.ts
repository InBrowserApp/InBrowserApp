import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldOptionsWeekday from './CronFieldOptionsWeekday.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

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
  it('renders weekday labels for specific mode', () => {
    const wrapper = mount(CronFieldOptionsWeekday, {
      props: {
        fieldConfig: {
          gridCols: 7,
        },
        mode: 'specific',
        specificValues: [],
        rangeStart: 0,
        rangeEnd: 6,
        'onUpdate:specificValues': () => {},
      },
    })

    const checkboxes = wrapper.findAll('.n-checkbox')
    expect(checkboxes).toHaveLength(7)
    expect(checkboxes[0]?.text()).toContain('sun')
  })

  it('renders range selects for range mode', () => {
    const wrapper = mount(CronFieldOptionsWeekday, {
      props: {
        fieldConfig: {
          gridCols: 7,
        },
        mode: 'range',
        specificValues: [],
        rangeStart: 1,
        rangeEnd: 5,
        'onUpdate:rangeStart': () => {},
        'onUpdate:rangeEnd': () => {},
      },
    })

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    expect(wrapper.text()).toContain('from')
    expect(wrapper.text()).toContain('to')
  })
})
