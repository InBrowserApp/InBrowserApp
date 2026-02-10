import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MimeTypeCategories from './MimeTypeCategories.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
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

    expect(wrapper.text()).toContain('applicationTitle')
    expect(wrapper.text()).toContain('audioTitle')
    expect(wrapper.text()).toContain('imageTitle')
    expect(wrapper.text()).toContain('videoTitle')
  })
})
