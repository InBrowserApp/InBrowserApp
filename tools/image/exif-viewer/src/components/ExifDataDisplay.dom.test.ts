import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ExifDataDisplay from './ExifDataDisplay.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2 class="tool-section-header"><slot /></h2>',
})

const NSpinStub = defineComponent({
  name: 'NSpin',
  props: { show: { type: Boolean, default: false } },
  template: '<div class="n-spin"><slot /></div>',
})

const NCollapseStub = defineComponent({
  name: 'NCollapse',
  props: { expandedNames: { type: Array, default: () => [] } },
  emits: ['update:expandedNames'],
  mounted() {
    this.$emit('update:expandedNames', ['advanced'])
  },
  template: '<div class="n-collapse"><slot /></div>',
})

const NFlexStub = defineComponent({
  name: 'NFlex',
  template: '<div class="n-flex"><slot /></div>',
})

const NButtonStub = defineComponent({
  name: 'NButton',
  props: { href: { type: String, default: '' } },
  template: '<a class="n-button" :href="href"><slot /></a>',
})

const ExifCategorySectionStub = defineComponent({
  name: 'ExifCategorySection',
  props: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    data: { type: Object, required: true },
  },
  template: '<div class="exif-category" :data-name="name"><slot /><slot name="extra" /></div>',
})

const globalStubs = {
  ToolSection: ToolSectionStub,
  ToolSectionHeader: ToolSectionHeaderStub,
  NSpin: NSpinStub,
  NCollapse: NCollapseStub,
  NFlex: NFlexStub,
  NButton: NButtonStub,
  ExifCategorySection: ExifCategorySectionStub,
}

describe('ExifDataDisplay', () => {
  it('splits EXIF data into sections and builds map links', async () => {
    const wrapper = mount(ExifDataDisplay, {
      props: {
        data: {
          ImageWidth: 100,
          Make: 'Canon',
          latitude: 10,
          longitude: 20,
          CustomTag: 'custom',
        },
        isLoading: false,
      },
      global: {
        stubs: globalStubs,
      },
    })

    const sections = wrapper.findAllComponents(ExifCategorySectionStub)
    const names = sections.map((section) => section.props('name'))

    expect(names).toEqual(expect.arrayContaining(['basic', 'camera', 'gps', 'advanced']))

    const gpsSection = sections.find((section) => section.props('name') === 'gps')
    expect(gpsSection?.props('data')).toMatchObject({ latitude: 10, longitude: 20 })

    const advancedSection = sections.find((section) => section.props('name') === 'advanced')
    expect(advancedSection?.props('data')).toMatchObject({ CustomTag: 'custom' })

    const links = wrapper.findAll('a.n-button').map((link) => link.attributes('href'))
    expect(links).toContain('https://www.google.com/maps?q=10,20')
    expect(links).toContain('https://uri.amap.com/marker?position=20,10')
  })

  it('handles missing gps coordinates without map links', () => {
    const wrapper = mount(ExifDataDisplay, {
      props: {
        data: {
          GPSLatitude: 10,
          GPSLongitude: 20,
        },
        isLoading: false,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.findAll('a.n-button')).toHaveLength(0)

    const setupState = (wrapper.vm.$ as unknown as { setupState: Record<string, unknown> })
      .setupState
    expect(setupState.gpsCoords).toBeNull()
    expect(setupState.googleMapsUrl).toBe('')
    expect(setupState.amapUrl).toBe('')
  })
})
