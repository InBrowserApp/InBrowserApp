import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageToPdfQueueItem from './ImageToPdfQueueItem.vue'

describe('ImageToPdfQueueItem', () => {
  it('shows the current rotation in the thumbnail and displayed dimensions', () => {
    const wrapper = mount(ImageToPdfQueueItem, {
      props: {
        item: {
          id: 'scan-1',
          file: new File(['image'], 'scan.jpg', { type: 'image/jpeg' }),
          name: 'scan.jpg',
          size: 2048,
          previewUrl: 'blob:scan-1',
          width: 1200,
          height: 800,
          rotation: 90,
        },
        index: 0,
        isLast: true,
        disabled: false,
        rotateLabel: 'Rotate 90 degrees',
        moveUpLabel: 'Move up',
        moveDownLabel: 'Move down',
        removeLabel: 'Remove',
        dragHandleLabel: 'Drag to reorder',
      },
    })

    expect(wrapper.get('.queue-item__preview-image').attributes('style')).toContain('rotate(90deg)')
    expect(wrapper.get('.queue-item__meta').text()).toContain('800 × 1200')
  })
})
