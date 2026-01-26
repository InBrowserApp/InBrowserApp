import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHAKE128: typeof import('./WhatIsSHAKE128.vue').default

beforeAll(async () => {
  WhatIsSHAKE128 = (await import('./WhatIsSHAKE128.vue')).default
})

describe('WhatIsSHAKE128', () => {
  it('renders the SHAKE128 description', () => {
    const wrapper = mount(WhatIsSHAKE128)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHAKE128 (FIPS 202)?')
    expect(description.attributes('data-description')).toContain('SHAKE128 (FIPS 202)')
  })
})
