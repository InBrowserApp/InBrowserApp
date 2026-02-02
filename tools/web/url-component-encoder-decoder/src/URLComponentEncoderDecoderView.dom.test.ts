import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import URLComponentEncoderDecoderView from './URLComponentEncoderDecoderView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout" :data-tool="info.toolID"><slot /></div>',
  },
}))

vi.mock('./components/URLComponentConverter.vue', () => ({
  default: {
    template: '<div class="converter" />',
  },
}))

vi.mock('./components/WhatIsURLEncoding.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

describe('URLComponentEncoderDecoderView', () => {
  it('renders the converter and guide sections', () => {
    const wrapper = mount(URLComponentEncoderDecoderView)

    expect(wrapper.find('.layout').attributes('data-tool')).toBe('url-component-encoder-decoder')
    expect(wrapper.find('.converter').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
