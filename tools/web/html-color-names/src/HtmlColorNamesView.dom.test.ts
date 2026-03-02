import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import HtmlColorNamesView from './HtmlColorNamesView.vue'
vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
  }
})
const ColorNameSearchStub = defineComponent({
  name: 'ColorNameSearch',
  props: {
    search: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
  },
  emits: ['update:search', 'update:category'],
  template: '<div class="color-search" :data-search="search" :data-category="category" />',
})
const ColorNameTableStub = defineComponent({
  name: 'ColorNameTable',
  props: {
    search: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
  },
  template: '<div class="color-table" :data-search="search" :data-category="category" />',
})
const WhatIsHtmlColorNamesStub = defineComponent({
  name: 'WhatIsHtmlColorNames',
  template: '<div class="what-is-html-color" />',
})
describe('HtmlColorNamesView', () => {
  it('passes stored search state to the table', async () => {
    const wrapper = mount(HtmlColorNamesView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          ColorNameSearch: ColorNameSearchStub,
          ColorNameTable: ColorNameTableStub,
          WhatIsHtmlColorNames: WhatIsHtmlColorNamesStub,
        },
      },
    })
    const search = wrapper.find('.color-search')
    const table = wrapper.find('.color-table')
    expect(search.attributes('data-search')).toBe('')
    expect(search.attributes('data-category')).toBe('all')
    expect(table.attributes('data-search')).toBe('')
    expect(table.attributes('data-category')).toBe('all')
    expect(wrapper.find('.what-is-html-color').exists()).toBe(true)
    wrapper.findComponent(ColorNameSearchStub).vm.$emit('update:search', 'sky')
    await nextTick()
    expect(wrapper.find('.color-table').attributes('data-search')).toBe('sky')
    wrapper.findComponent(ColorNameSearchStub).vm.$emit('update:category', 'blue')
    await nextTick()
    expect(wrapper.find('.color-table').attributes('data-category')).toBe('blue')
  })
})
