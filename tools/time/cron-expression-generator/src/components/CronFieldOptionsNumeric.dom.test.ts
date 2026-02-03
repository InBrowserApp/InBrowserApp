import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldOptionsNumeric from './CronFieldOptionsNumeric.vue'

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

describe('CronFieldOptionsNumeric', () => {
  it('renders numeric checkboxes for specific mode', () => {
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
        'onUpdate:specificValues': () => {},
      },
    })

    expect(wrapper.findAll('.n-checkbox')).toHaveLength(3)
  })

  it('renders range selects for range mode', () => {
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
        'onUpdate:rangeStart': () => {},
        'onUpdate:rangeEnd': () => {},
      },
    })

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    expect(selects[0]?.props('options')).toHaveLength(3)
  })
})
