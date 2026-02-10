import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import IOSWebClip from './iOSWebClip.vue'
import IOSWebClipSettings from './iOSWebClipSettings.vue'
import IOSWebClipSettingsDisplay from './iOSWebClipSettingsDisplay.vue'
import IOSWebClipSettingsDedicatedImage from './iOSWebClipSettingsDedicatedImage.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')
  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        const value = isRef(source) ? source.value : source
        return value ? 'blob:ios' : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div class="stub"><slot /><slot name="icon" /></div>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NGridItem = defineComponent({
    name: 'NGridItem',
    template: '<div class="n-grid-item"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon"><slot /></span>',
  })

  const NTabs = defineComponent({
    name: 'NTabs',
    template: '<div class="n-tabs"><slot /></div>',
  })

  const NTabPane = defineComponent({
    name: 'NTabPane',
    props: { tab: { type: String, default: '' } },
    template: '<div class="n-tab-pane"><slot /></div>',
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: { label: { type: String, default: '' } },
    template: '<div class="n-form-item"><slot /></div>',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: { value: { type: String, default: '' } },
    emits: ['update:value'],
    template:
      '<input class="n-color" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: { value: { type: Number, default: 0 } },
    emits: ['update:value'],
    template:
      '<input class="n-slider" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NImage = defineComponent({
    name: 'NImage',
    props: { src: { type: String, default: '' } },
    template: '<img class="n-image" :data-src="src" />',
  })

  return {
    NGrid,
    NGridItem,
    NIcon,
    NTabs,
    NTabPane,
    NFormItem,
    NColorPicker,
    NSlider,
    NImage,
    NText: Base,
  }
})

vi.mock('@vicons/fa/Apple', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'AppleIcon',
      template: '<span class="apple-icon" />',
    }),
  }
})

const generalInfoOptions: GeneralInfoOptions = {
  name: 'App Name',
  short_name: 'App',
  description: 'Description',
  start_url: '/',
  display: 'standalone',
  theme_color: '#ffffff',
  theme_color_dark_enabled: false,
  theme_color_dark: '#000000',
  background_color: '#ffffff',
  path: '/icons/',
}

const baseOptions: iOSWebClipOptions = {
  backgroundColor: '#ffffff',
  margin: 12,
}

describe('IOSWebClip', () => {
  it('renders preview and settings with props', () => {
    const IOSWebClipPreviewStub = {
      name: 'IOSWebClipPreview',
      props: ['image', 'options', 'name'],
      template: '<div class="preview" />',
    }
    const IOSWebClipSettingsStub = {
      name: 'IOSWebClipSettings',
      props: ['image', 'options'],
      template: '<div class="settings" />',
    }

    const wrapper = mount(IOSWebClip, {
      props: {
        image: undefined,
        generalInfoOptions,
        options: { ...baseOptions },
      },
      global: {
        stubs: {
          IOSWebClipPreview: IOSWebClipPreviewStub,
          IOSWebClipSettings: IOSWebClipSettingsStub,
        },
      },
    })

    expect(wrapper.text()).toContain('iOS Web Clip')
    expect(wrapper.findComponent(IOSWebClipPreviewStub).props('name')).toBe(
      generalInfoOptions.short_name,
    )
    expect(wrapper.findComponent(IOSWebClipSettingsStub).props('options')).toEqual(baseOptions)
  })

  it('forwards settings updates through v-model', async () => {
    const IOSWebClipPreviewStub = {
      name: 'IOSWebClipPreview',
      props: ['image', 'options', 'name'],
      template: '<div class="preview" />',
    }
    const IOSWebClipSettingsStub = {
      name: 'IOSWebClipSettings',
      props: ['image', 'options'],
      emits: ['update:options'],
      template: '<div class="settings" />',
    }

    const options = { ...baseOptions }
    const wrapper = mount(IOSWebClip, {
      props: {
        image: undefined,
        generalInfoOptions,
        options,
      },
      global: {
        stubs: {
          IOSWebClipPreview: IOSWebClipPreviewStub,
          IOSWebClipSettings: IOSWebClipSettingsStub,
        },
      },
    })

    const nextOptions = { ...options, margin: 20 }
    wrapper.findComponent(IOSWebClipSettingsStub).vm.$emit('update:options', nextOptions)
    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([[nextOptions]])
  })
})

describe('IOSWebClipSettings', () => {
  it('renders tab panes with settings components', async () => {
    const IOSWebClipSettingsDisplayStub = {
      name: 'IOSWebClipSettingsDisplay',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="display" />',
    }
    const IOSWebClipSettingsDedicatedImageStub = {
      name: 'IOSWebClipSettingsDedicatedImage',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="dedicated" />',
    }
    const IOSWebClipSettingsDownloadStub = {
      name: 'IOSWebClipSettingsDownload',
      props: ['options', 'image'],
      template: '<div class="download" />',
    }

    const options = { ...baseOptions }

    const wrapper = mount(IOSWebClipSettings, {
      props: {
        image: undefined,
        options,
      },
      global: {
        stubs: {
          IOSWebClipSettingsDisplay: IOSWebClipSettingsDisplayStub,
          IOSWebClipSettingsDedicatedImage: IOSWebClipSettingsDedicatedImageStub,
          IOSWebClipSettingsDownload: IOSWebClipSettingsDownloadStub,
        },
      },
    })

    expect(wrapper.findComponent(IOSWebClipSettingsDisplayStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(IOSWebClipSettingsDedicatedImageStub).props('options')).toEqual(
      options,
    )
    expect(wrapper.findComponent(IOSWebClipSettingsDownloadStub).props('image')).toBeUndefined()

    const nextDisplayOptions = { ...options, margin: 20 }
    const nextDedicatedOptions = { ...options, image: new Blob(['icon'], { type: 'image/png' }) }

    wrapper
      .findComponent(IOSWebClipSettingsDisplayStub)
      .vm.$emit('update:options', nextDisplayOptions)
    wrapper
      .findComponent(IOSWebClipSettingsDedicatedImageStub)
      .vm.$emit('update:options', nextDedicatedOptions)

    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([
      [nextDisplayOptions],
      [nextDedicatedOptions],
    ])
  })
})

describe('IOSWebClipSettingsDisplay', () => {
  it('renders background and margin inputs', () => {
    const wrapper = mount(IOSWebClipSettingsDisplay, {
      props: {
        options: { ...baseOptions },
      },
    })

    const formItems = wrapper.findAllComponents({ name: 'NFormItem' })
    expect(formItems).toHaveLength(2)
    expect(formItems.map((item) => item.props('label'))).toEqual(['backgroundColor', 'margin'])
  })
})

describe('IOSWebClipSettingsDedicatedImage', () => {
  it('toggles dedicated image rendering', async () => {
    const ImageUploadStub = {
      name: 'ImageUpload',
      emits: ['update:file'],
      template: '<div class="image-upload" />',
    }
    const RemoveButtonStub = {
      name: 'RemoveButton',
      emits: ['click'],
      template: '<button class="remove" @click="$emit(\'click\')">remove</button>',
    }
    const NotUsingDedicatedImageNoteStub = {
      name: 'NotUsingDedicatedImageNote',
      template: '<div class="not-using" />',
    }
    const UsingDedicatedImageNoteStub = {
      name: 'UsingDedicatedImageNote',
      template: '<div class="using" />',
    }

    const options: iOSWebClipOptions = {
      ...baseOptions,
      image: undefined,
    }

    const wrapper = mount(IOSWebClipSettingsDedicatedImage, {
      props: { options },
      global: {
        stubs: {
          ImageUpload: ImageUploadStub,
          RemoveButton: RemoveButtonStub,
          NotUsingDedicatedImageNote: NotUsingDedicatedImageNoteStub,
          UsingDedicatedImageNote: UsingDedicatedImageNoteStub,
        },
      },
    })

    expect(wrapper.find('.not-using').exists()).toBe(true)
    expect(wrapper.find('.using').exists()).toBe(false)

    const imageBlob = new Blob(['icon'], { type: 'image/png' })
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', imageBlob)
    await nextTick()

    expect(options.image).toBe(imageBlob)
    expect(wrapper.find('.using').exists()).toBe(true)
    expect(wrapper.find('.n-image').attributes('data-src')).toBe('blob:ios')

    await wrapper.find('.remove').trigger('click')
    await nextTick()

    expect(options.image).toBeUndefined()
    expect(wrapper.find('.not-using').exists()).toBe(true)
  })
})
