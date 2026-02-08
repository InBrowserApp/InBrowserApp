import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import PaletteExportPanel from './PaletteExportPanel.vue'

const objectUrlState = vi.hoisted(() => ({
  value: 'available' as 'available' | 'missing',
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === 'missing') {
          return null
        }
        const value = isRef(source) ? source.value : source
        return value ? 'blob:export' : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options'],
      emits: ['update:value'],
      template: '<select />',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value'],
      template: '<textarea data-test="export" :value="value" />',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: ['href', 'download', 'disabled', 'tag', 'text'],
      template: '<a :href="href" :download="download" :data-disabled="disabled"><slot /></a>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<i><slot /></i>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

vi.mock('@vicons/fluent/ArrowDownload24Regular', () => ({
  default: defineComponent({ template: '<span />' }),
}))

const CopyStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button><slot /></button>',
})

const panelProps = {
  colors: [
    {
      hex: '#112233',
      rgb: 'rgb(17, 34, 51)',
      hsl: 'hsl(210, 50%, 13%)',
      ratio: 0.5,
      count: 5,
      hue: 210,
      lightness: 13,
      textColor: '#fff',
    },
  ],
  fileName: 'sample.png',
}

describe('PaletteExportPanel', () => {
  beforeEach(() => {
    objectUrlState.value = 'available'
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('updates export content and download info when format changes', async () => {
    const wrapper = mount(PaletteExportPanel, {
      props: panelProps,
      global: {
        stubs: {
          CopyToClipboardButton: CopyStub,
        },
      },
    })

    expect(wrapper.find('[data-test="export"]').element.getAttribute('value')).toContain(':root')
    expect(wrapper.find('a').attributes('download')).toBe('sample.css')
    expect(wrapper.find('a').attributes('href')).toBe('blob:export')

    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'json')
    await nextTick()

    expect(wrapper.find('[data-test="export"]').element.getAttribute('value')).toContain('"hex"')
    expect(wrapper.find('a').attributes('download')).toBe('sample.json')
  })

  it('omits href and disables download when no object URL is available', () => {
    objectUrlState.value = 'missing'

    const wrapper = mount(PaletteExportPanel, {
      props: panelProps,
      global: {
        stubs: {
          CopyToClipboardButton: CopyStub,
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('data-disabled')).toBe('true')
  })
})
