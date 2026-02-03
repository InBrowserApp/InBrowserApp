import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgFilePreview from './SvgFilePreview.vue'

vi.mock('filesize', () => ({
  filesize: (value: number) => `size-${value}`,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vicons/fluent/Delete24Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'DeleteIcon',
      template: '<svg class="delete-icon" />',
    }),
  }
})

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
    template: '<button @click="$emit(\'click\')"><slot /></button>',
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
    expect(wrapper.text()).toContain('size-2048')
    expect(wrapper.text()).toContain('delete')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})
