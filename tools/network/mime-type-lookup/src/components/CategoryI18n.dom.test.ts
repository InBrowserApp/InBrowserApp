import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryI18n from './CategoryI18n.vue'

const categories = [
  { key: 'application', label: 'Application' },
  { key: 'audio', label: 'Audio' },
  { key: 'font', label: 'Font' },
  { key: 'image', label: 'Image' },
  { key: 'message', label: 'Message' },
  { key: 'model', label: 'Model' },
  { key: 'multipart', label: 'Multipart' },
  { key: 'text', label: 'Text' },
  { key: 'video', label: 'Video' },
]

describe('CategoryI18n', () => {
  it.each(categories)('renders the label for $key', ({ key, label }) => {
    const wrapper = mount(CategoryI18n, {
      props: {
        category: key,
      },
    })

    expect(wrapper.text()).toBe(label)
  })

  it('falls back to unknown for unsupported categories', () => {
    const wrapper = mount(CategoryI18n, {
      props: {
        category: 'other',
      },
    })

    expect(wrapper.text()).toBe('Unknown')
  })
})
