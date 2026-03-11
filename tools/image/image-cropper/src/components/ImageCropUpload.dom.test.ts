import { beforeEach, describe, expect, it, vi } from 'vitest'

const { messageErrorMock } = vi.hoisted(() => ({
  messageErrorMock: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref('blob:preview'),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NUpload = defineComponent({
    name: 'NUpload',
    props: {
      onBeforeUpload: {
        type: Function,
        required: false,
      },
    },
    setup(_, { slots }) {
      return () => h('div', { class: 'upload-stub' }, slots.default?.())
    },
  })

  const NUploadDragger = defineComponent({
    name: 'NUploadDragger',
    setup(_, { slots }) {
      return () => h('div', { class: 'upload-dragger-stub' }, slots.default?.())
    },
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    setup(_, { slots, emit }) {
      return () =>
        h('button', { onClick: () => emit('click') }, [slots.icon?.(), slots.default?.()])
    },
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    setup(_, { slots }) {
      return () => h('div', { class: 'flex-stub' }, slots.default?.())
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    setup(_, { slots }) {
      return () => h('i', { class: 'icon-stub' }, slots.default?.())
    },
  })

  const NImage = defineComponent({
    name: 'NImage',
    props: {
      src: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () => h('img', { src: props.src, alt: props.alt })
    },
  })

  const NP = defineComponent({
    name: 'NP',
    setup(_, { slots }) {
      return () => h('p', slots.default?.())
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  })

  return {
    NButton,
    NFlex,
    NIcon,
    NImage,
    NP,
    NText,
    NUpload,
    NUploadDragger,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

import { mount } from '@vue/test-utils'
import ImageCropUpload from './ImageCropUpload.vue'

beforeEach(() => {
  messageErrorMock.mockReset()
})

const toolStubs = {
  ToolSection: false,
  ToolSectionHeader: false,
}

describe('ImageCropUpload', () => {
  it('accepts a single image file and emits it through the file model', async () => {
    const wrapper = mount(ImageCropUpload, {
      props: {
        file: null,
        width: null,
        height: null,
      },
      global: {
        stubs: toolStubs,
      },
    })

    const upload = wrapper.getComponent({ name: 'NUpload' })
    const beforeUpload = upload.props('onBeforeUpload') as (payload: {
      file: { file: File }
      fileList: Array<{ file: File }>
    }) => Promise<boolean>

    const file = new File(['image'], 'avatar.png', { type: 'image/png' })
    const result = await beforeUpload({ file: { file }, fileList: [{ file }] })

    expect(result).toBe(false)
    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
    expect(messageErrorMock).not.toHaveBeenCalled()
  })

  it('rejects non-image files and multiple uploads', async () => {
    const wrapper = mount(ImageCropUpload, {
      props: {
        file: null,
        width: null,
        height: null,
      },
      global: {
        stubs: toolStubs,
      },
    })

    const upload = wrapper.getComponent({ name: 'NUpload' })
    const beforeUpload = upload.props('onBeforeUpload') as (payload: {
      file: { file: File }
      fileList: Array<{ file: File }>
    }) => Promise<boolean>

    const textFile = new File(['text'], 'notes.txt', { type: 'text/plain' })
    await beforeUpload({ file: { file: textFile }, fileList: [{ file: textFile }] })
    expect(messageErrorMock).toHaveBeenCalledWith('Please select a valid image file')

    messageErrorMock.mockReset()

    const imageFile = new File(['image'], 'avatar.png', { type: 'image/png' })
    await beforeUpload({
      file: { file: imageFile },
      fileList: [{ file: imageFile }, { file: imageFile }],
    })
    expect(messageErrorMock).toHaveBeenCalledWith('Only one image can be uploaded')
  })

  it('ignores empty upload payloads', async () => {
    const wrapper = mount(ImageCropUpload, {
      props: {
        file: null,
        width: null,
        height: null,
      },
      global: { stubs: toolStubs },
    })

    const upload = wrapper.getComponent({ name: 'NUpload' })
    const beforeUpload = upload.props('onBeforeUpload') as (payload: {
      file: { file?: File }
      fileList: Array<{ file: File }>
    }) => Promise<boolean>

    const result = await beforeUpload({ file: {}, fileList: [] })
    expect(result).toBe(false)
    expect(wrapper.emitted('update:file')).toBeUndefined()
    expect(messageErrorMock).not.toHaveBeenCalled()
  })

  it('renders uploaded file details and clears the file when requested', async () => {
    const file = new File(['image'], 'hero-banner.webp', { type: 'image/webp' })

    const wrapper = mount(ImageCropUpload, {
      props: {
        file,
        width: 1200,
        height: 630,
      },
      global: {
        stubs: toolStubs,
      },
    })

    expect(wrapper.text()).toContain('hero-banner.webp')
    expect(wrapper.text()).toContain('Dimensions: 1200 × 630')
    expect(wrapper.get('img').attributes('src')).toBe('blob:preview')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:file')?.[0]).toEqual([null])
  })
})
