import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadFileItem from './UploadFileItem.vue'

const objectUrlState = vi.hoisted(() => ({
  value: 'blob:preview' as string | null,
}))

vi.mock('@vueuse/core', async () => {
  const { computed, isRef } = await import('vue')

  return {
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === null) return null
        const value = isRef(source) ? source.value : source
        return value ? objectUrlState.value : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button class="remove-btn" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
    }),
    NFlex: BaseStub,
    NIcon: BaseStub,
    NText: BaseStub,
  }
})

describe('UploadFileItem', () => {
  it('hides preview when no object URL is available and emits remove', async () => {
    objectUrlState.value = null

    const file = new File(['gif'], 'demo.gif', { type: 'image/gif' })
    const wrapper = mount(UploadFileItem, {
      props: {
        file,
        removeLabel: 'Remove',
      },
    })

    expect(wrapper.find('img.preview-image').exists()).toBe(false)

    await wrapper.find('button.remove-btn').trigger('click')
    expect(wrapper.emitted('remove')?.length).toBe(1)
  })

  it('renders preview image metadata when object URL exists', () => {
    objectUrlState.value = 'blob:item-preview'

    const file = new File(['gif'], 'shown.gif', { type: 'image/gif' })
    const wrapper = mount(UploadFileItem, {
      props: {
        file,
        removeLabel: 'Remove',
      },
    })

    const preview = wrapper.find('img.preview-image')
    expect(preview.exists()).toBe(true)
    expect(preview.attributes('src')).toBe('blob:item-preview')
    expect(preview.attributes('alt')).toBe('shown.gif')
  })
})
