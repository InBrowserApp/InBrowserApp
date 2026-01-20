import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PaletteResults from './PaletteResults.vue'

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const ToolSectionHeaderStub = {
  template: '<div><slot /></div>',
}

const SpinStub = defineComponent({
  name: 'NSpin',
  props: ['show'],
  template: '<div><slot /></div>',
})

const GridStub = defineComponent({
  name: 'NGrid',
  template: '<div><slot /></div>',
})

const GridItemStub = defineComponent({
  name: 'NGridItem',
  template: '<div><slot /></div>',
})

const StatisticStub = defineComponent({
  name: 'NStatistic',
  props: ['label'],
  template: '<div><slot /></div>',
})

const FlexStub = defineComponent({
  name: 'NFlex',
  template: '<div><slot /></div>',
})

const SelectStub = defineComponent({
  name: 'NSelect',
  props: ['options', 'value'],
  template: '<select />',
})

const InputStub = defineComponent({
  name: 'NInput',
  props: ['value'],
  template: '<textarea data-test="export" :value="value" />',
})

const ButtonStub = defineComponent({
  name: 'NButton',
  template: '<button><slot /></button>',
})

const IconStub = defineComponent({
  name: 'NIcon',
  template: '<i><slot /></i>',
})

const EmptyStub = defineComponent({
  name: 'NEmpty',
  props: ['description'],
  template: '<div />',
})

const CopyStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button><slot /></button>',
})

const CopyTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: ['content'],
  template: '<div><slot :copy="() => {}" /></div>',
})

describe('PaletteResults', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:palette')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders export content for CSS format', () => {
    const wrapper = mount(PaletteResults, {
      props: {
        colors: [
          {
            hex: '#112233',
            rgb: 'rgb(17, 34, 51)',
            hsl: 'hsl(210, 50%, 13%)',
            count: 6,
            ratio: 0.6,
            hue: 210,
            lightness: 13,
            textColor: '#fff',
          },
        ],
        dominant: {
          hex: '#112233',
          rgb: 'rgb(17, 34, 51)',
          hsl: 'hsl(210, 50%, 13%)',
          count: 6,
          ratio: 0.6,
          hue: 210,
          lightness: 13,
          textColor: '#fff',
        },
        totalPixels: 10,
        fileName: 'sample.png',
        isLoading: false,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NSpin: SpinStub,
          NGrid: GridStub,
          NGridItem: GridItemStub,
          NStatistic: StatisticStub,
          NFlex: FlexStub,
          NSelect: SelectStub,
          NInput: InputStub,
          'n-input': InputStub,
          NButton: ButtonStub,
          NIcon: IconStub,
          NEmpty: EmptyStub,
          CopyToClipboardButton: CopyStub,
          CopyToClipboardTooltip: CopyTooltipStub,
        },
      },
    })

    expect(wrapper.text()).toContain('#112233')
    expect(wrapper.text()).toContain('Export palette')
  })
})
