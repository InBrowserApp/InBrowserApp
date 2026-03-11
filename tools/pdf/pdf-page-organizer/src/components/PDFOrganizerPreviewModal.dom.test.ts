import { NModal } from 'naive-ui'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PDFOrganizerPreviewModal from './PDFOrganizerPreviewModal.vue'

describe('PDFOrganizerPreviewModal', () => {
  it('renders preview content and emits navigation events', async () => {
    const wrapper = mount(PDFOrganizerPreviewModal, {
      props: {
        visible: true,
        page: 4,
        imageUrl: 'blob:preview',
        placeholderUrl: 'blob:thumb',
        rotation: 90,
        isLoading: false,
        canPrev: true,
        canNext: true,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Page 4 Preview')
    const placeholderImage = wrapper.get('.preview-image--placeholder')
    const previewImage = wrapper.get('.preview-image--full')

    expect(placeholderImage.attributes('src')).toBe('blob:thumb')
    expect(previewImage.attributes('src')).toBe('blob:preview')
    expect(previewImage.attributes('style')).toContain('rotate(90deg)')
    expect(previewImage.classes()).not.toContain('preview-image--ready')

    await previewImage.trigger('load')
    expect(previewImage.classes()).toContain('preview-image--ready')
    expect(placeholderImage.classes()).toContain('preview-image--hidden')

    const prevButton = wrapper.get('button[aria-label="Previous page"]')
    const nextButton = wrapper.get('button[aria-label="Next page"]')

    await prevButton.trigger('click')
    await nextButton.trigger('click')

    expect(wrapper.emitted('prev')).toBeTruthy()
    expect(wrapper.emitted('next')).toBeTruthy()

    await wrapper.get('button[aria-label="close"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders empty state and only closes when modal hides', async () => {
    const wrapper = mount(PDFOrganizerPreviewModal, {
      props: {
        visible: true,
        page: null,
        imageUrl: null,
        placeholderUrl: null,
        rotation: 0,
        isLoading: false,
        canPrev: false,
        canNext: false,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    expect(wrapper.text()).not.toContain('Preview')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No Data')

    await wrapper.getComponent(NModal).vm.$emit('update:show', true)
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.getComponent(NModal).vm.$emit('update:show', false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
