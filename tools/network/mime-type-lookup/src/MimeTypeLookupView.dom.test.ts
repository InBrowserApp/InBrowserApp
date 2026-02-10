import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import MimeTypeLookupView from './MimeTypeLookupView.vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
  }
})

const MimeTypeSearchStub = defineComponent({
  name: 'MimeTypeSearch',
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
  template: '<div class="mime-search" :data-search="search" :data-category="category" />',
})

const MimeTypeTableStub = defineComponent({
  name: 'MimeTypeTable',
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
  template: '<div class="mime-table" :data-search="search" :data-category="category" />',
})

describe('MimeTypeLookupView', () => {
  it('passes and syncs search state across child sections', async () => {
    const wrapper = mount(MimeTypeLookupView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          MimeTypeSearch: MimeTypeSearchStub,
          MimeTypeTable: MimeTypeTableStub,
          WhatIsMimeType: {
            template: '<div class="what-is" />',
          },
        },
      },
    })

    const search = wrapper.find('.mime-search')
    const table = wrapper.find('.mime-table')

    expect(search.attributes('data-search')).toBe('')
    expect(search.attributes('data-category')).toBe('all')
    expect(table.attributes('data-search')).toBe('')
    expect(table.attributes('data-category')).toBe('all')
    expect(wrapper.find('.what-is').exists()).toBe(true)

    const searchComponent = wrapper.findComponent({ name: 'MimeTypeSearch' })
    searchComponent.vm.$emit('update:search', 'json')
    searchComponent.vm.$emit('update:category', 'application')
    await nextTick()

    expect(wrapper.find('.mime-search').attributes('data-search')).toBe('json')
    expect(wrapper.find('.mime-search').attributes('data-category')).toBe('application')
    expect(wrapper.find('.mime-table').attributes('data-search')).toBe('json')
    expect(wrapper.find('.mime-table').attributes('data-category')).toBe('application')
  })
})
