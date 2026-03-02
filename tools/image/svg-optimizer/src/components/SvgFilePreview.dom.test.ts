import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { filesize } from 'filesize'
import SvgFilePreview from './SvgFilePreview.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  return {
    NText: makeStub('NText'),
    NIcon: makeStub('NIcon'),
    NButton,
  }
})

describe('SvgFilePreview', () => {
  it('renders preview details and emits delete', async () => {
    const wrapper = mount(SvgFilePreview, {
      props: {
        previewUrl: 'blob:preview',
        fileName: 'icon.svg',
        size: 2048,
      },
    })

    expect(wrapper.find('img').attributes('src')).toBe('blob:preview')
    expect(wrapper.text()).toContain('icon.svg')
    expect(wrapper.text()).toContain(filesize(2048) as string)
    expect(wrapper.text()).toContain('Delete')
    expect(wrapper.findAllComponents({ name: 'NIcon' })).toHaveLength(1)

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})
