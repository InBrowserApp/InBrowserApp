import { describe, expect, it, vi } from 'vitest'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/KeyGenerator.vue', () => ({
  default: {
    template: '<div class="key-generator" />',
  },
}))

vi.mock('./components/WhatIsSshKey.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

import { mount } from '@vue/test-utils'
import SshKeyGeneratorView from './SshKeyGeneratorView.vue'

describe('SshKeyGeneratorView', () => {
  it('renders tool layout and sections', () => {
    const wrapper = mount(SshKeyGeneratorView)

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.key-generator').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
