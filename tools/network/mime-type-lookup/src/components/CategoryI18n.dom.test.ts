import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryI18n from './CategoryI18n.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const categories = [
  'application',
  'audio',
  'font',
  'image',
  'message',
  'model',
  'multipart',
  'text',
  'video',
]

describe('CategoryI18n', () => {
  it.each(categories)('renders the label for %s', (category) => {
    const wrapper = mount(CategoryI18n, {
      props: {
        category,
      },
    })

    expect(wrapper.text()).toBe(category)
  })

  it('falls back to unknown for unsupported categories', () => {
    const wrapper = mount(CategoryI18n, {
      props: {
        category: 'other',
      },
    })

    expect(wrapper.text()).toBe('unknown')
  })
})
