import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHAKE256: typeof import('./WhatIsSHAKE256.vue').default

beforeAll(async () => {
  WhatIsSHAKE256 = (await import('./WhatIsSHAKE256.vue')).default
})

describe('WhatIsSHAKE256', () => {
  it('renders the SHAKE256 description', () => {
    const wrapper = mount(WhatIsSHAKE256)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHAKE256 (FIPS 202)?')
    expect(description.attributes('data-description')).toContain('SHAKE256 (FIPS 202)')
  })
})
