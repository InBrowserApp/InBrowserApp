import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUpload from './ImageUpload.vue'

const messageMock = {
  error: vi.fn(),
}

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NUpload = defineComponent({
    name: 'NUpload',
    emits: ['before-upload'],
    template: '<div><slot /></div>',
  })

  const NUploadDragger = defineComponent({
    name: 'NUploadDragger',
    template: '<div><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span><slot /></span>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span><slot /></span>',
  })

  const NP = defineComponent({
    name: 'NP',
    template: '<p><slot /></p>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
  })

  return {
    useMessage: () => messageMock,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    NFlex,
    NButton,
  }
})

vi.mock('@vicons/fluent/Image24Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Delete20Regular', () => ({ default: {} }))

const baseProps = {
  title: 'Upload',
  dragDropText: 'Drag and drop',
  supportText: 'Supports images',
  selectedCountLabel: 'Selected',
  removeLabel: 'Remove',
  clearAllLabel: 'Clear all',
  invalidTypeMessage: 'invalid-type',
  duplicateMessage: 'duplicate',
}
const layoutStubs = {
  ToolSection: { template: '<section><slot /></section>' },
  ToolSectionHeader: { template: '<header><slot /></header>' },
}

describe('ImageUpload', () => {
  beforeEach(() => {
    messageMock.error.mockClear()
  })

  it('ignores empty upload payloads', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        ...baseProps,
        files: [],
      },
      global: {
        stubs: layoutStubs,
      },
    })

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', { file: { file: null } })

    expect(wrapper.emitted('update:files')).toBeUndefined()
    expect(messageMock.error).not.toHaveBeenCalled()
  })

  it('rejects invalid files without extensions', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        ...baseProps,
        files: [],
      },
      global: {
        stubs: layoutStubs,
      },
    })

    const file = new File(['data'], 'README.', { type: 'text/plain' })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', { file: { file } })

    expect(messageMock.error).toHaveBeenCalledWith('invalid-type')
    expect(wrapper.emitted('update:files')).toBeUndefined()
  })

  it('removes and clears files', async () => {
    const fileA = new File(['a'], 'a.png', { type: 'image/png' })
    const fileB = new File(['b'], 'b.png', { type: 'image/png' })

    const wrapper = mount(ImageUpload, {
      props: {
        ...baseProps,
        files: [fileA, fileB],
      },
      global: {
        stubs: layoutStubs,
      },
    })

    const buttons = wrapper.findAll('button')
    const removeButtons = buttons.filter((button) => button.text() === 'Remove')
    const clearButton = buttons.find((button) => button.text() === 'Clear all')

    await removeButtons[0]?.trigger('click')
    expect(wrapper.emitted('update:files')?.[0]?.[0]).toEqual([fileB])

    await clearButton?.trigger('click')
    expect(wrapper.emitted('update:files')?.[1]?.[0]).toEqual([])
  })
})
