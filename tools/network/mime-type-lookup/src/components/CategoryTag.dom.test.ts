import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryTag from './CategoryTag.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NTag: defineComponent({
      name: 'NTag',
      props: {
        type: {
          type: String,
          default: 'default',
        },
      },
      template: '<span class="n-tag" :data-type="type"><slot name="icon" /><slot /></span>',
    }),
  }
})

const tagCases: Array<[string, string]> = [
  ['application', 'info'],
  ['audio', 'default'],
  ['font', 'warning'],
  ['image', 'success'],
  ['message', 'info'],
  ['model', 'default'],
  ['multipart', 'info'],
  ['text', 'info'],
  ['video', 'warning'],
  ['unknown', 'info'],
]

describe('CategoryTag', () => {
  it.each(tagCases)('maps %s to %s tag type', (category, expectedType) => {
    const wrapper = mount(CategoryTag, {
      props: {
        category,
      },
      global: {
        stubs: {
          CategoryIcon: {
            props: ['category'],
            template: '<span class="category-icon" :data-category="category" />',
          },
          CategoryI18n: {
            props: ['category'],
            template: '<span class="category-label" :data-category="category" />',
          },
        },
      },
    })

    const tag = wrapper.find('.n-tag')
    expect(tag.attributes('data-type')).toBe(expectedType)
    expect(wrapper.find('.category-label').attributes('data-category')).toBe(category)
  })
})
