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
    expect(wrapper.get('img').attributes('src')).toBe('blob:preview')
    expect(wrapper.get('img').attributes('style')).toContain('rotate(90deg)')

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
