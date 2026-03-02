import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PortNumberLookupView from './PortNumberLookupView.vue'
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')
  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
  }
})
const PortSearchStub = defineComponent({
  name: 'PortSearch',
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
  template: '<div class="port-search" :data-search="search" :data-category="category" />',
})
const PortTableStub = defineComponent({
  name: 'PortTable',
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
  template: '<div class="port-table" :data-search="search" :data-category="category" />',
})
describe('PortNumberLookupView', () => {
  it('passes search state to the tool sections', () => {
    const wrapper = mount(PortNumberLookupView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PortSearch: PortSearchStub,
          PortTable: PortTableStub,
          WhatIsPort: {
            template: '<div class="what-is-port" />',
          },
        },
      },
    })
    const search = wrapper.find('.port-search')
    const table = wrapper.find('.port-table')
    expect(search.attributes('data-search')).toBe('')
    expect(search.attributes('data-category')).toBe('all')
    expect(table.attributes('data-search')).toBe('')
    expect(table.attributes('data-category')).toBe('all')
    expect(wrapper.find('.what-is-port').exists()).toBe(true)
  })
  it('syncs v-model updates from PortSearch into PortTable', async () => {
    const wrapper = mount(PortNumberLookupView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PortSearch: PortSearchStub,
          PortTable: PortTableStub,
          WhatIsPort: {
            template: '<div class="what-is-port" />',
          },
        },
      },
    })
    const search = wrapper.findComponent(PortSearchStub)
    await search.vm.$emit('update:search', 'ssh')
    await search.vm.$emit('update:category', 'system')
    await wrapper.vm.$nextTick()
    const table = wrapper.find('.port-table')
    expect(table.attributes('data-search')).toBe('ssh')
    expect(table.attributes('data-category')).toBe('system')
  })
})
