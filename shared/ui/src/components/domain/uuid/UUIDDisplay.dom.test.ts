import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import UUIDDisplay from './UUIDDisplay.vue'

const copySpy = vi.fn()

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('div', { class: 'tooltip' }, slots.default?.({ copy: copySpy }))
  },
})

describe('UUIDDisplay', () => {
  it('renders the uuid and triggers copy on click', async () => {
    copySpy.mockReset()

    const wrapper = mount(UUIDDisplay, {
      props: {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
      },
      global: {
        stubs: {
          CopyToClipboardTooltip: CopyToClipboardTooltipStub,
        },
      },
    })

    const text = wrapper.get('code.uuid-display')
    expect(text.text()).toContain('123e4567-e89b-12d3-a456-426614174000')

    await text.trigger('click')
    expect(copySpy).toHaveBeenCalledTimes(1)
  })
})
