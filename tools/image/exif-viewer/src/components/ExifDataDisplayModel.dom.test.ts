import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NSpin: defineComponent({
      name: 'NSpin',
      template: '<div class="n-spin"><slot /></div>',
    }),
    NCollapse: defineComponent({
      name: 'NCollapse',
      props: { expandedNames: { type: Array, default: () => [] } },
      emits: ['update:expandedNames'],
      template:
        '<div class="n-collapse" @click="$emit(\'update:expandedNames\', [\'advanced\'])"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: { href: { type: String, default: '' } },
      template: '<a class="n-button" :href="href"><slot /></a>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}))

vi.mock('./ExifCategorySection.vue', () => ({
  default: defineComponent({
    name: 'ExifCategorySection',
    props: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      data: { type: Object, required: true },
    },
    template: '<div class="exif-category"><slot /><slot name="extra" /></div>',
  }),
}))

let ExifDataDisplay: typeof import('./ExifDataDisplay.vue').default

beforeAll(async () => {
  ExifDataDisplay = (await import('./ExifDataDisplay.vue')).default
})

describe('ExifDataDisplay collapse binding', () => {
  it('updates expanded names through v-model listeners', async () => {
    const wrapper = mount(ExifDataDisplay, {
      props: {
        data: {
          latitude: 10,
          longitude: 20,
        },
        isLoading: false,
      },
    })

    await wrapper.find('.n-collapse').trigger('click')

    const setupState = (wrapper.vm.$ as unknown as { setupState: { expandedCategories: string[] } })
      .setupState
    expect(setupState.expandedCategories).toEqual(['advanced'])
  })
})
