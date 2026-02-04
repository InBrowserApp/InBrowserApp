import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ULIDDisplay from './ULIDDisplay.vue'

const copySpy = vi.fn()

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: ['content'],
  setup(_, { slots }) {
    return () => slots.default?.({ copy: copySpy })
  },
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span class="ulid-display" @click="$emit(\'click\')"><slot /></span>',
})

describe('ULIDDisplay', () => {
  beforeEach(() => {
    copySpy.mockClear()
  })

  it('renders the ULID and triggers copy on click', async () => {
    const wrapper = mount(ULIDDisplay, {
      props: {
        ulid: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
      },
      global: {
        stubs: {
          CopyToClipboardTooltip: CopyToClipboardTooltipStub,
          NText: NTextStub,
        },
      },
    })

    expect(wrapper.text()).toContain('01ARZ3NDEKTSV4RRFFQ69G5FAV')

    await wrapper.find('.ulid-display').trigger('click')
    expect(copySpy).toHaveBeenCalled()
  })
})
