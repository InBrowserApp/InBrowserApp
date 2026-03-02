import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MimeTypeCategories from './MimeTypeCategories.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NUl: defineComponent({
      name: 'NUl',
      template: '<ul class="n-ul"><slot /></ul>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li class="n-li"><slot /></li>',
    }),
  }
})
describe('MimeTypeCategories', () => {
  it('lists the main category descriptions', () => {
    const wrapper = mount(MimeTypeCategories, {
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('Application:')
    expect(wrapper.text()).toContain('Audio:')
    expect(wrapper.text()).toContain('Image:')
    expect(wrapper.text()).toContain('Video:')
  })
})
