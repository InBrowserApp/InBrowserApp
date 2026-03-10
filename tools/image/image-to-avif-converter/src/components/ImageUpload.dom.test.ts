import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImageToAvifUploadSection from './ImageToAvifUploadSection.vue'
import ImageUpload from './ImageUpload.vue'

const messageMock = {
  error: vi.fn(),
}

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const baseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    useMessage: () => messageMock,
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
    NFlex: baseStub,
    NIcon: baseStub,
    NP: baseStub,
    NText: baseStub,
    NUpload: defineComponent({
      name: 'NUpload',
      props: ['accept', 'defaultUpload', 'showFileList', 'multiple'],
      emits: ['beforeUpload'],
      template: '<div class="upload"><slot /></div>',
    }),
    NUploadDragger: baseStub,
  }
})

function mountWithI18n(component: object, options: Record<string, unknown> = {}) {
  return mount(component as never, {
    ...options,
    global: {
      stubs: {
        ToolSection: defineComponent({ template: '<section><slot /></section>' }),
        ToolSectionHeader: defineComponent({ template: '<header><slot /></header>' }),
        ...(options.global as { stubs?: Record<string, unknown> } | undefined)?.stubs,
      },
    },
  })
}

describe('ImageUpload', () => {
  it('adds valid files and filters duplicates', async () => {
    const wrapper = mountWithI18n(ImageUpload, {
      props: {
        title: 'Upload',
        dragDropText: 'Drop files',
        supportText: 'Support text',
        selectedCountLabel: 'Selected',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear all',
        invalidTypeMessage: 'Invalid type',
        duplicateMessage: 'Duplicate',
        files: [],
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    const validFile = new File(['a'], 'photo.avif', { type: 'image/avif' })

    await upload.vm.$emit('beforeUpload', { file: { file: validFile } })
    expect(wrapper.emitted('update:files')?.[0]?.[0]).toEqual([validFile])

    await wrapper.setProps({ files: [validFile] } as never)
    await upload.vm.$emit('beforeUpload', { file: { file: validFile } })
    expect(messageMock.error).toHaveBeenCalledWith('Duplicate')
  })

  it('rejects invalid files and supports removing items', async () => {
    const validFile = new File(['a'], 'photo.png', { type: 'image/png' })
    const wrapper = mountWithI18n(ImageUpload, {
      props: {
        title: 'Upload',
        dragDropText: 'Drop files',
        supportText: 'Support text',
        selectedCountLabel: 'Selected',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear all',
        invalidTypeMessage: 'Invalid type',
        duplicateMessage: 'Duplicate',
        files: [validFile],
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    await upload.vm.$emit('beforeUpload', {
      file: { file: new File(['x'], 'bad.txt', { type: 'text/plain' }) },
    })

    expect(messageMock.error).toHaveBeenCalledWith('Invalid type')

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    const emittedAfterClear = wrapper.emitted('update:files')
    expect(emittedAfterClear?.[emittedAfterClear.length - 1]?.[0]).toEqual([])

    await wrapper.setProps({ files: [validFile] } as never)
    const refreshedButtons = wrapper.findAll('button')
    await refreshedButtons[1]!.trigger('click')
    const emittedAfterRemove = wrapper.emitted('update:files')
    expect(emittedAfterRemove?.[emittedAfterRemove.length - 1]?.[0]).toEqual([])
  })

  it('ignores missing uploads and files without image extensions', async () => {
    const wrapper = mountWithI18n(ImageUpload, {
      props: {
        title: 'Upload',
        dragDropText: 'Drop files',
        supportText: 'Support text',
        selectedCountLabel: 'Selected',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear all',
        invalidTypeMessage: 'Invalid type',
        duplicateMessage: 'Duplicate',
        files: [],
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    await upload.vm.$emit('beforeUpload', { file: { file: null } })
    await upload.vm.$emit('beforeUpload', {
      file: { file: new File(['x'], 'invalid.', { type: '' }) },
    })

    expect(wrapper.emitted('update:files')).toBeUndefined()
    expect(messageMock.error).toHaveBeenCalledWith('Invalid type')
  })
})

describe('ImageToAvifUploadSection', () => {
  it('builds translated props for the upload component and forwards updates', async () => {
    const wrapper = mountWithI18n(ImageToAvifUploadSection, {
      props: {
        files: [],
      },
      global: {
        stubs: {
          ImageUpload: defineComponent({
            name: 'ImageUpload',
            props: ['title', 'supportText'],
            emits: ['update:files'],
            template:
              '<div class="upload-props">{{ title }}|{{ supportText }}<button class="upload-forward" @click="$emit(\'update:files\', [{ name: \'next.png\' }])" /></div>',
          }),
        },
      },
    })

    expect(wrapper.text()).toContain('Upload images')
    expect(wrapper.text()).toContain('AVIF')

    await wrapper.find('.upload-forward').trigger('click')
    expect(wrapper.emitted('update:files')?.[0]?.[0]).toHaveLength(1)
  })
})
