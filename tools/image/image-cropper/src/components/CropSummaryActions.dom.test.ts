import { describe, expect, it, vi } from 'vitest'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const passthrough = (name: string, tag = 'div') =>
    defineComponent({
      name,
      props: {
        label: {
          type: String,
          default: '',
        },
        value: {
          type: String,
          default: '',
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        loading: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      setup(props, { slots, emit }) {
        if (name === 'NStatistic') {
          return () => h('div', { 'data-stat': props.label }, props.value)
        }

        return () =>
          h(
            tag,
            {
              'data-name': name,
              'data-disabled': String(props.disabled),
              'data-loading': String(props.loading),
              onClick: () => emit('click'),
            },
            [slots.icon?.(), slots.default?.()],
          )
      },
    })

  return {
    NButton: passthrough('NButton', 'button'),
    NGrid: passthrough('NGrid'),
    NIcon: passthrough('NIcon', 'i'),
    NStatistic: passthrough('NStatistic'),
  }
})

import { mount } from '@vue/test-utils'
import CropSummaryActions from './CropSummaryActions.vue'

describe('CropSummaryActions', () => {
  it('renders crop/export stats and emits crop requests', async () => {
    const wrapper = mount(CropSummaryActions, {
      props: {
        cropWidth: 1200,
        cropHeight: 800,
        resolvedWidth: 300,
        resolvedHeight: 200,
        canCrop: true,
        isProcessing: false,
      },
    })

    expect(wrapper.text()).toContain('1200 × 800')
    expect(wrapper.text()).toContain('300 × 200')
    expect(wrapper.findComponent({ name: 'NIcon' }).exists()).toBe(true)

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('crop')).toHaveLength(1)
  })

  it('reflects disabled and loading states on the crop button', () => {
    const wrapper = mount(CropSummaryActions, {
      props: {
        cropWidth: 100,
        cropHeight: 100,
        resolvedWidth: 100,
        resolvedHeight: 100,
        canCrop: false,
        isProcessing: true,
      },
    })

    const button = wrapper.get('button')
    expect(button.attributes('data-disabled')).toBe('true')
    expect(button.attributes('data-loading')).toBe('true')
    expect(wrapper.text()).toContain('Cropping image...')
  })
})
