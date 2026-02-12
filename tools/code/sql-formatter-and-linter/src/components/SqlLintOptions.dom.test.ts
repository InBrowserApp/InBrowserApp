import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlLintOptions from './SqlLintOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
  mount(SqlLintOptions, {
    props: {
      checkSelectStar: true,
      checkUnsafeMutation: true,
      requireSemicolon: true,
      maxLineLength: 100,
    },
  })

describe('SqlLintOptions', () => {
  it('emits updates for lint controls', async () => {
    const wrapper = mountComponent()

    const switches = wrapper.findAll('.switch')
    expect(switches).toHaveLength(3)
    await switches[0]!.setValue(false)
    await switches[1]!.setValue(false)
    await switches[2]!.setValue(false)

    const numberInput = wrapper.find('.input-number')
    await numberInput.setValue('120')

    expect(wrapper.emitted('update:checkSelectStar')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:checkUnsafeMutation')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:requireSemicolon')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:maxLineLength')?.[0]).toEqual([120])
  })
})
