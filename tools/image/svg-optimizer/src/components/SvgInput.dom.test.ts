import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import SvgInput from './SvgInput.vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: () => ref('blob:preview'),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  const NUpload = defineComponent({
    name: 'NUpload',
    inheritAttrs: false,
    emits: ['change'],
    template: '<div class="n-upload"><slot /></div>',
  })

  const NTabs = defineComponent({
    name: 'NTabs',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div class="n-tabs"><slot /></div>',
  })

  const NTabPane = defineComponent({
    name: 'NTabPane',
    props: {
      name: {
        type: String,
        default: '',
      },
      tab: {
        type: String,
        default: '',
      },
    },
    template: '<div class="n-tab-pane"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: undefined,
      },
    },
    emits: ['update:value'],
    template: '<div class="n-input" />',
  })

  return {
    NUpload,
    NUploadDragger: Base,
    NIcon: Base,
    NText: Base,
    NP: Base,
    NTabs,
    NTabPane,
    NInput,
  }
})

const SvgFilePreviewStub = defineComponent({
  name: 'SvgFilePreview',
  props: {
    fileName: {
      type: String,
      default: '',
    },
  },
  template: '<div class="svg-preview">{{ fileName }}</div>',
})

const mountInput = () =>
  mount(SvgInput, {
    global: {
      stubs: {
        ToolSection: {
          template: '<section><slot /></section>',
        },
        ToolSectionHeader: {
          template: '<h2><slot /></h2>',
        },
        SvgFilePreview: SvgFilePreviewStub,
      },
    },
  })

describe('SvgInput', () => {
  it('accepts valid SVG text input', async () => {
    const wrapper = mountInput()

    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'text')
    await nextTick()

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', '<svg></svg>')
    await nextTick()

    const svgEmits = wrapper.emitted('update:svgString')
    const fileEmits = wrapper.emitted('update:fileName')

    expect(svgEmits?.[svgEmits.length - 1]).toEqual(['<svg></svg>'])
    expect(fileEmits?.[fileEmits.length - 1]).toEqual(['pasted.svg'])
    expect(wrapper.find('.svg-preview').exists()).toBe(true)

    input.vm.$emit('update:value', '')
    await nextTick()

    expect(svgEmits?.[svgEmits.length - 1]).toEqual([''])
    expect(fileEmits?.[fileEmits.length - 1]).toEqual([''])
    expect(wrapper.find('.svg-preview').exists()).toBe(false)
  })

  it('shows an error for invalid SVG text', async () => {
    const wrapper = mountInput()

    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'text')
    await nextTick()

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'not svg')
    await nextTick()

    expect(wrapper.text()).toContain('Invalid SVG content')
  })

  it('handles empty, invalid, and unreadable file uploads', async () => {
    const wrapper = mountInput()

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('change', { fileList: [] })
    await flushPromises()

    const validFile = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' })
    upload.vm.$emit('change', { fileList: [{ file: validFile }] })
    await flushPromises()
    expect(wrapper.find('.svg-preview').exists()).toBe(true)

    const preview = wrapper.findComponent({ name: 'SvgFilePreview' })
    preview.vm.$emit('delete')
    await nextTick()
    expect(wrapper.find('.svg-preview').exists()).toBe(false)

    const invalidFile = {
      name: 'invalid.svg',
      size: 1,
      text: vi.fn().mockResolvedValue('not svg'),
    } as unknown as File

    const uploadAfterClear = wrapper.findComponent({ name: 'NUpload' })
    uploadAfterClear.vm.$emit('change', { fileList: [{ file: invalidFile }] })
    await flushPromises()
    expect(wrapper.text()).toContain('Invalid SVG content')

    const brokenFile = {
      name: 'broken.svg',
      size: 1,
      text: vi.fn().mockRejectedValue(new Error('boom')),
    } as unknown as File

    uploadAfterClear.vm.$emit('change', { fileList: [{ file: brokenFile }] })
    await flushPromises()
    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('handles file uploads and updates the models', async () => {
    const wrapper = mountInput()

    const upload = wrapper.findComponent({ name: 'NUpload' })
    const file = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' })

    upload.vm.$emit('change', { fileList: [{ file }] })
    await flushPromises()

    const svgEmits = wrapper.emitted('update:svgString')
    const fileEmits = wrapper.emitted('update:fileName')

    expect(svgEmits?.[svgEmits.length - 1]).toEqual(['<svg></svg>'])
    expect(fileEmits?.[fileEmits.length - 1]).toEqual(['icon.svg'])
    expect(wrapper.find('.svg-preview').exists()).toBe(true)
  })
})
