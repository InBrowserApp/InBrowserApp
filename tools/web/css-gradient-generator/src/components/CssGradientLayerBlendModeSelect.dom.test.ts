import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CssGradientLayerBlendModeSelect from './CssGradientLayerBlendModeSelect.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NSelect = defineComponent({
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
  })

  return { NSelect }
})

describe('CssGradientLayerBlendModeSelect', () => {
  it('combines blend mode options and emits updates', async () => {
    const wrapper = mount(CssGradientLayerBlendModeSelect, {
      props: {
        layerBlendMode: 'normal',
      },
    })

    await nextTick()

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as { value: string }[]
    expect(options).toHaveLength(16)
    expect(options.map((option) => option.value)).toContain('normal')
    expect(options.map((option) => option.value)).toContain('luminosity')

    select.vm.$emit('update:value', 'screen')
    expect(wrapper.emitted('update:layerBlendMode')?.[0]).toEqual(['screen'])
  })
})
