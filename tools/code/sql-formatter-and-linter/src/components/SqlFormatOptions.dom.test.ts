import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlFormatOptions from './SqlFormatOptions.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<label><slot /></label>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: String,
          default: '',
        },
        options: {
          type: Array,
          default: () => [],
        },
      },
      emits: ['update:value'],
      template:
        '<select class="select" :value="value" @change="$emit(\'update:value\', ($event.target).value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
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
        '<input class="input-number" type="number" :value="value" @input="$emit(\'update:value\', Number(($event.target).value))" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: {
        value: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:value'],
      template:
        '<input class="switch" type="checkbox" :checked="value" @change="$emit(\'update:value\', ($event.target).checked)" />',
    }),
  }
})

const mountComponent = () =>
  mount(SqlFormatOptions, {
    props: {
      dialect: 'sql',
      tabWidth: 2,
      useTabs: false,
      linesBetweenQueries: 1,
      expressionWidth: 50,
      keywordCase: 'preserve',
      dataTypeCase: 'preserve',
      functionCase: 'preserve',
    },
  })

describe('SqlFormatOptions', () => {
  it('emits updates for dialect and formatting controls', async () => {
    const wrapper = mountComponent()

    const selects = wrapper.findAll('.select')
    expect(selects).toHaveLength(4)
    await selects[0]!.setValue('mysql')
    await selects[1]!.setValue('upper')
    await selects[2]!.setValue('lower')
    await selects[3]!.setValue('upper')

    const numbers = wrapper.findAll('.input-number')
    expect(numbers).toHaveLength(3)
    await numbers[0]!.setValue('4')
    await numbers[1]!.setValue('2')
    await numbers[2]!.setValue('80')

    const switches = wrapper.findAll('.switch')
    expect(switches).toHaveLength(1)
    await switches[0]!.setValue(true)

    expect(wrapper.emitted('update:dialect')?.[0]).toEqual(['mysql'])
    expect(wrapper.emitted('update:keywordCase')?.[0]).toEqual(['upper'])
    expect(wrapper.emitted('update:dataTypeCase')?.[0]).toEqual(['lower'])
    expect(wrapper.emitted('update:functionCase')?.[0]).toEqual(['upper'])
    expect(wrapper.emitted('update:tabWidth')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:linesBetweenQueries')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:expressionWidth')?.[0]).toEqual([80])
    expect(wrapper.emitted('update:useTabs')?.[0]).toEqual([true])
  })
})
