import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import ImageInput from './ImageInput.vue'

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const ToolSectionHeaderStub = {
  template: '<div><slot /></div>',
}

const UploadStub = defineComponent({
  name: 'NUpload',
  emits: ['before-upload'],
  template: '<div><slot /></div>',
})

const UploadDraggerStub = defineComponent({
  name: 'NUploadDragger',
  template: '<div><slot /></div>',
})

const ButtonStub = defineComponent({
  name: 'NButton',
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
})

const ImageStub = defineComponent({
  name: 'NImage',
  template: '<img />',
})

const TextStub = defineComponent({
  name: 'NText',
  template: '<span><slot /></span>',
})

const FlexStub = defineComponent({
  name: 'NFlex',
  template: '<div><slot /></div>',
})

const IconStub = defineComponent({
  name: 'NIcon',
  template: '<i><slot /></i>',
})

const ParagraphStub = defineComponent({
  name: 'NP',
  template: '<p><slot /></p>',
})

const mountWithProvider = (props: Record<string, unknown>) =>
  mount(
    defineComponent({
      render() {
        return h(NMessageProvider, null, {
          default: () => h(ImageInput, props),
        })
      },
    }),
    {
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NUpload: UploadStub,
          NUploadDragger: UploadDraggerStub,
          NButton: ButtonStub,
          NImage: ImageStub,
          NText: TextStub,
          NFlex: FlexStub,
          NIcon: IconStub,
          NP: ParagraphStub,
        },
      },
    },
  )

describe('ImageInput', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits update when a file is uploaded', () => {
    const wrapper = mountWithProvider({ file: null })
    const file = new File(['data'], 'sample.png', { type: 'image/png' })

    const input = wrapper.findComponent(ImageInput)
    input.vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    const emitted = input.emitted('update:file')
    expect(emitted?.[0]).toEqual([file])
  })

  it('emits update when remove is clicked', async () => {
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const wrapper = mountWithProvider({ file })

    const button = wrapper.find('button')
    await button.trigger('click')

    const input = wrapper.findComponent(ImageInput)
    const emitted = input.emitted('update:file')
    expect(emitted?.[0]).toEqual([null])
  })
})
