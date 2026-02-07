import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUpload from './ImageUpload.vue'

const messageMock = {
  error: vi.fn(),
}

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    useMessage: () => messageMock,
    NUpload: defineComponent({
      name: 'NUpload',
      emits: ['before-upload'],
      template: '<div class="upload"><slot /></div>',
    }),
    NUploadDragger: BaseStub,
    NIcon: BaseStub,
    NText: BaseStub,
    NP: BaseStub,
    NFlex: BaseStub,
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button class="clear-all" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<section><slot /></section>',
  })

  return {
    ToolSection: BaseStub,
    ToolSectionHeader: BaseStub,
  }
})

vi.mock('./UploadFileItem.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'UploadFileItem',
      props: ['file'],
      emits: ['remove'],
      template: '<div class="upload-file-item" />',
    }),
  }
})

const baseProps = {
  title: 'Upload',
  dragDropText: 'Drag files',
  supportText: 'GIF only',
  selectedCountLabel: 'selected',
  removeLabel: 'Remove',
  clearAllLabel: 'Clear all',
  invalidTypeMessage: 'Invalid type',
  duplicateMessage: 'Duplicate file',
}

describe('ImageUpload', () => {
  beforeEach(() => {
    messageMock.error.mockClear()
  })

  it('ignores upload payloads without a file object', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        ...baseProps,
        files: [],
      },
    })

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', { file: {} })

    expect(wrapper.emitted('update:files')).toBeUndefined()
    expect(messageMock.error).not.toHaveBeenCalled()
  })

  it('removes individual files and clears all files', async () => {
    const first = new File(['a'], 'a.gif', { type: 'image/gif' })
    const second = new File(['b'], 'b.gif', { type: 'image/gif' })

    const wrapper = mount(ImageUpload, {
      props: {
        ...baseProps,
        files: [first, second],
      },
    })

    const items = wrapper.findAllComponents({ name: 'UploadFileItem' })
    items[0]?.vm.$emit('remove')

    const firstUpdate = wrapper.emitted('update:files')?.[0]?.[0] as File[] | undefined
    expect(firstUpdate).toEqual([second])

    await wrapper.find('button.clear-all').trigger('click')

    const updates = wrapper.emitted('update:files')
    const lastUpdate = updates?.[updates.length - 1]?.[0] as File[] | undefined
    expect(lastUpdate).toEqual([])
  })
})
