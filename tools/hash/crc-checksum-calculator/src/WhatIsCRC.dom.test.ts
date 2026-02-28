import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCRC from './WhatIsCRC.vue'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsCRC', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsCRC)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is CRC?')
    expect(description.attributes('data-description')).toContain(
      'CRC (Cyclic Redundancy Check) is a type of checksum algorithm',
    )
  })
})
