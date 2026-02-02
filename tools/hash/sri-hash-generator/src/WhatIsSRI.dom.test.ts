import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSRI: typeof import('./WhatIsSRI.vue').default

beforeAll(async () => {
  WhatIsSRI = (await import('./WhatIsSRI.vue')).default
})

describe('WhatIsSRI', () => {
  it('renders the SRI description', () => {
    const wrapper = mount(WhatIsSRI)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is Subresource Integrity (SRI)?')
    expect(description.attributes('data-description')).toContain('Subresource Integrity (SRI)')
  })
})
