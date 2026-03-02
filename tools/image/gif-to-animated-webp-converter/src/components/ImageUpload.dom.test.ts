import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImageUpload from './ImageUpload.vue'
const messageMock = {
  error: vi.fn(),
}
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: `<div class="${name.toLowerCase()}"><slot /></div>`,
    })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    useMessage: () => messageMock,
    NUpload: defineComponent({
      name: 'NUpload',
      emits: ['before-upload'],
      template: '<div class="n-upload"><slot /></div>',
    }),
    NUploadDragger: wrapper('NUploadDragger'),
    NIcon: wrapper('NIcon'),
    NText: wrapper('NText'),
    NP: wrapper('NP'),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button class="n-button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
    }),
  }
})
vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3><slot /></h3>',
    }),
  }
})
const UploadFileItemStub = defineComponent({
  name: 'UploadFileItem',
  props: {
    file: {
      type: Object,
      required: true,
    },
    removeLabel: {
      type: String,
      required: true,
    },
  },
  emits: ['remove'],
  template:
    '<button class="remove-item" @click="$emit(\'remove\')">{{ file.name }} {{ removeLabel }}</button>',
})
const baseProps = {
  title: 'Upload',
  dragDropText: 'Drop GIF files',
  supportText: 'GIF only',
  selectedCountLabel: 'Selected',
  removeLabel: 'Remove',
  clearAllLabel: 'Clear all',
  invalidTypeMessage: 'Invalid type',
  duplicateMessage: 'Duplicate file',
}
function mountUpload(files: File[] = []) {
  return mount(ImageUpload, {
    props: {
      ...baseProps,
      files,
    },
    global: {
      stubs: {
        UploadFileItem: UploadFileItemStub,
      },
    },
  })
}
describe('ImageUpload', () => {
  beforeEach(() => {
    messageMock.error.mockClear()
  })
  it('accepts valid GIF files and rejects invalid, missing, or duplicate files', async () => {
    const wrapper = mountUpload()
    const upload = wrapper.findComponent({ name: 'NUpload' })
    await upload.vm.$emit('before-upload', { file: { file: null } })
    expect(wrapper.emitted('update:files')).toBeUndefined()
    const invalid = new File(['png'], 'bad.png', { type: 'image/png' })
    await upload.vm.$emit('before-upload', { file: { file: invalid } })
    expect(messageMock.error).toHaveBeenCalledWith('Invalid type')
    const valid = new File(['gif'], 'ok.gif', { type: 'image/gif' })
    await upload.vm.$emit('before-upload', { file: { file: valid } })
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[valid]])
    await wrapper.setProps({ files: [valid] })
    await upload.vm.$emit('before-upload', { file: { file: valid } })
    expect(messageMock.error).toHaveBeenCalledWith('Duplicate file')
    const extOnly = new File(['gif'], 'ext-only.GIF', { type: '' })
    await upload.vm.$emit('before-upload', { file: { file: extOnly } })
    expect(wrapper.emitted('update:files')?.[1]).toEqual([[valid, extOnly]])
  })
  it('removes single files and clears all files', async () => {
    const a = new File(['a'], 'a.gif', { type: 'image/gif' })
    const b = new File(['b'], 'b.gif', { type: 'image/gif' })
    const wrapper = mountUpload([a, b])
    const removeButtons = wrapper.findAll('button.remove-item')
    const firstRemove = removeButtons[0]
    if (!firstRemove) {
      throw new Error('Expected a remove button')
    }
    await firstRemove.trigger('click')
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[b]])
    const clearButton = wrapper
      .findAll('button.n-button')
      .find((button) => button.text().includes('Clear all'))
    if (!clearButton) {
      throw new Error('Expected clear-all button')
    }
    await clearButton.trigger('click')
    expect(wrapper.emitted('update:files')?.[1]).toEqual([[]])
  })
})
