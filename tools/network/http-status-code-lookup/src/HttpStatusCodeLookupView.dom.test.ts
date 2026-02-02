import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import HttpStatusCodeLookupView from './HttpStatusCodeLookupView.vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')
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

const HttpStatusCodeSearchStub = defineComponent({
  name: 'HttpStatusCodeSearch',
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
  template: '<div class="status-search" :data-search="search" :data-category="category" />',
})

const HttpStatusCodeTableStub = defineComponent({
  name: 'HttpStatusCodeTable',
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
  template: '<div class="status-table" :data-search="search" :data-category="category" />',
})

describe('HttpStatusCodeLookupView', () => {
  it('passes search state to the tool sections', () => {
    const wrapper = mount(HttpStatusCodeLookupView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HttpStatusCodeSearch: HttpStatusCodeSearchStub,
          HttpStatusCodeTable: HttpStatusCodeTableStub,
          WhatIsHttpStatusCode: {
            template: '<div class="what-is-status" />',
          },
        },
      },
    })

    const search = wrapper.find('.status-search')
    const table = wrapper.find('.status-table')

    expect(search.attributes('data-search')).toBe('')
    expect(search.attributes('data-category')).toBe('all')
    expect(table.attributes('data-search')).toBe('')
    expect(table.attributes('data-category')).toBe('all')
    expect(wrapper.find('.what-is-status').exists()).toBe(true)
  })
})
