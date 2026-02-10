import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsTextStatistics from './WhatIsTextStatistics.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('WhatIsTextStatistics', () => {
  it('renders title and description', () => {
    const wrapper = mount(WhatIsTextStatistics, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('title')
    expect(wrapper.find('p').text()).toBe('description')
  })
})
