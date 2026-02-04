import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotWindowOptions from './CodeShotWindowOptions.vue'

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
      template: '<div />',
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
      template: '<button type="button" @click="$emit(\'update:value\', !value)" />',
    }),
  }
})

describe('CodeShotWindowOptions', () => {
  it('renders options and emits updates', () => {
    const wrapper = mount(CodeShotWindowOptions, {
      props: {
        windowStyle: 'mac',
        showLineNumbers: false,
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as { label: string; value: string }[]
    expect(options).toEqual([
      { label: 'windowMac', value: 'mac' },
      { label: 'windowWindows', value: 'windows' },
      { label: 'windowNone', value: 'none' },
    ])

    select.vm.$emit('update:value', 'windows')
    expect(wrapper.emitted('update:windowStyle')?.[0]).toEqual(['windows'])

    const switchControl = wrapper.findComponent({ name: 'NSwitch' })
    switchControl.vm.$emit('update:value', true)
    expect(wrapper.emitted('update:showLineNumbers')?.[0]).toEqual([true])
  })
})
