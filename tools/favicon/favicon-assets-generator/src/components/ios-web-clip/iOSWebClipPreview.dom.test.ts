import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  const width = ref(200)
  const height = ref(100)
  return {
    useObjectUrl: () => ref('blob:mock'),
    useElementSize: () => ({ width, height }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NSkeleton: defineComponent({
      name: 'NSkeleton',
      template: '<div class="n-skeleton" />',
    }),
  }
})

import iOSWebClipPreview from './iOSWebClipPreview.vue'

const baseOptions: iOSWebClipOptions = {
  backgroundColor: '#112233',
  margin: 8,
}

describe('iOSWebClipPreview', () => {
  it('renders a skeleton and default name when image is missing', () => {
    const wrapper = mount(iOSWebClipPreview, {
      props: {
        image: undefined,
        options: baseOptions,
      },
    })

    expect(wrapper.find('.n-skeleton').exists()).toBe(true)
    expect(wrapper.find('.name').text()).toBe('App')

    const style = wrapper.find('.container').attributes('style')
    expect(style).toContain('--ios-homescreen-background-width: 200px')
    expect(style).toContain('--ios-homescreen-background-height: 100px')
  })

  it('renders the image from options and applies styles', () => {
    const optionsImage = new Blob(['icon'], { type: 'image/png' })

    const wrapper = mount(iOSWebClipPreview, {
      props: {
        image: undefined,
        name: 'My App',
        options: {
          ...baseOptions,
          image: optionsImage,
          backgroundColor: '#abcdef',
          margin: 10,
        },
      },
    })

    const img = wrapper.find('img.icon')
    expect(img.exists()).toBe(true)
    expect(img.attributes('style')).toContain('--icon-margin: 5%')

    const background = wrapper.find('.icon-background')
    expect(background.attributes('style')).toContain('--icon-background-color: #abcdef')

    expect(wrapper.find('.name').text()).toBe('My App')
  })
})
