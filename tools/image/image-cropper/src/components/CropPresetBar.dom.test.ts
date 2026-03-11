import { describe, expect, it, vi } from 'vitest'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      type: {
        type: String,
        default: 'default',
      },
    },
    emits: ['click'],
    setup(props, { slots, emit }) {
      return () =>
        h(
          'button',
          {
            'data-type': props.type,
            onClick: () => emit('click'),
          },
          slots.default?.(),
        )
    },
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    setup(_, { slots }) {
      return () => h('div', { class: 'space-stub' }, slots.default?.())
    },
  })

  return {
    NButton,
    NSpace,
  }
})

import { mount } from '@vue/test-utils'
import CropPresetBar from './CropPresetBar.vue'

describe('CropPresetBar', () => {
  it('renders options and emits preset updates when a button is clicked', async () => {
    const wrapper = mount(CropPresetBar, {
      props: {
        presetId: 'free',
        options: [
          { id: 'free', label: 'Free' },
          { id: '1:1', label: '1:1' },
          { id: '16:9', label: '16:9' },
        ],
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]?.attributes('data-type')).toBe('primary')
    expect(buttons[1]?.attributes('data-type')).toBe('default')

    await buttons[2]!.trigger('click')
    expect(wrapper.emitted('update:presetId')?.[0]).toEqual(['16:9'])
  })
})
