import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import DesktopBrowser from './DesktopBrowser.vue'
import DesktopBrowserSettings from './DesktopBrowserSettings.vue'
import DesktopBrowserSettingsDedicatedImage from './DesktopBrowserSettingsDedicatedImage.vue'
import DesktopBrowserSettingsDisplay from './DesktopBrowserSettingsDisplay.vue'
import ChromeTabDarkNote from './ChromeTabDarkNote.vue'

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
        return value ? 'blob:dedicated' : null
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

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="n-button" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NTooltip = defineComponent({
    name: 'NTooltip',
    template: '<div class="n-tooltip"><slot name="trigger" /><slot /></div>',
  })

  const NImage = defineComponent({
    name: 'NImage',
    props: { src: { type: String, default: '' } },
    template: '<img class="n-image" :data-src="src" />',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: { checked: { type: Boolean, default: false } },
    emits: ['update:checked'],
    template:
      '<label class="n-checkbox"><input type="checkbox" :checked="checked" @change="$emit(\'update:checked\', !checked)" /><slot /></label>',
  })

  const NCollapseTransition = defineComponent({
    name: 'NCollapseTransition',
    props: { show: { type: Boolean, default: false } },
    template: '<div v-if="show" class="n-collapse"><slot /></div>',
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

  const NP = defineComponent({
    name: 'NP',
    template: '<p class="n-p"><slot /></p>',
  })

  return {
    NGrid,
    NGridItem,
    NIcon,
    NTabs,
    NTabPane,
    NButton,
    NTooltip,
    NImage,
    NCheckbox,
    NCollapseTransition,
    NFormItem,
    NColorPicker,
    NSlider,
    NP,
    NText: Base,
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

const baseOptions: DesktopBrowserOptions = {
  original: true,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 10,
  margin: 5,
}

describe('DesktopBrowser', () => {
  it('renders preview and settings with props', () => {
    const DesktopBrowserPreviewStub = {
      name: 'DesktopBrowserPreview',
      props: ['image', 'options', 'generalInfoOptions'],
      template: '<div class="preview" />',
    }
    const DesktopBrowserSettingsStub = {
      name: 'DesktopBrowserSettings',
      props: ['image', 'options'],
      template: '<div class="settings" />',
    }

    const wrapper = mount(DesktopBrowser, {
      props: {
        image: undefined,
        generalInfoOptions,
        options: { ...baseOptions },
      },
      global: {
        stubs: {
          DesktopBrowserPreview: DesktopBrowserPreviewStub,
          DesktopBrowserSettings: DesktopBrowserSettingsStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Desktop Browser & Google Result')
    expect(wrapper.findComponent(DesktopBrowserPreviewStub).props('generalInfoOptions')).toEqual(
      generalInfoOptions,
    )
    expect(wrapper.findComponent(DesktopBrowserSettingsStub).props('options')).toEqual(baseOptions)
  })
})

describe('DesktopBrowserSettings', () => {
  it('renders tab panes with settings components', async () => {
    const DesktopBrowserSettingsDisplayStub = {
      name: 'DesktopBrowserSettingsDisplay',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="display" />',
    }
    const DesktopBrowserSettingsDedicatedImageStub = {
      name: 'DesktopBrowserSettingsDedicatedImage',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="dedicated" />',
    }
    const DesktopBrowserSettingsDownloadStub = {
      name: 'DesktopBrowserSettingsDownload',
      props: ['options', 'image'],
      template: '<div class="download" />',
    }

    const options = { ...baseOptions }

    const wrapper = mount(DesktopBrowserSettings, {
      props: {
        image: undefined,
        options,
      },
      global: {
        stubs: {
          DesktopBrowserSettingsDisplay: DesktopBrowserSettingsDisplayStub,
          DesktopBrowserSettingsDedicatedImage: DesktopBrowserSettingsDedicatedImageStub,
          DesktopBrowserSettingsDownload: DesktopBrowserSettingsDownloadStub,
        },
      },
    })

    expect(wrapper.findComponent(DesktopBrowserSettingsDisplayStub).props('options')).toEqual(
      options,
    )
    expect(
      wrapper.findComponent(DesktopBrowserSettingsDedicatedImageStub).props('options'),
    ).toEqual(options)
    expect(wrapper.findComponent(DesktopBrowserSettingsDownloadStub).props('image')).toBeUndefined()

    const nextDisplayOptions = { ...options, original: false }
    const nextDedicatedOptions = { ...options, image: new Blob(['icon'], { type: 'image/png' }) }

    wrapper
      .findComponent(DesktopBrowserSettingsDisplayStub)
      .vm.$emit('update:options', nextDisplayOptions)
    wrapper
      .findComponent(DesktopBrowserSettingsDedicatedImageStub)
      .vm.$emit('update:options', nextDedicatedOptions)

    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([
      [nextDisplayOptions],
      [nextDedicatedOptions],
    ])
  })
})

describe('DesktopBrowserSettingsDedicatedImage', () => {
  it('toggles between dedicated image states', async () => {
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

    const options: DesktopBrowserOptions = {
      ...baseOptions,
      image: undefined,
    }

    const wrapper = mount(DesktopBrowserSettingsDedicatedImage, {
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
    expect(wrapper.find('.n-image').attributes('data-src')).toBe('blob:dedicated')

    await wrapper.find('.remove').trigger('click')
    await nextTick()

    expect(options.image).toBeUndefined()
    expect(wrapper.find('.not-using').exists()).toBe(true)
  })
})

describe('DesktopBrowserSettingsDisplay', () => {
  it('reveals background controls when toggled', async () => {
    const options: DesktopBrowserOptions = {
      ...baseOptions,
      original: true,
      background: false,
    }

    const wrapper = mount(DesktopBrowserSettingsDisplay, {
      props: { options },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes).toHaveLength(1)

    await checkboxes[0]!.trigger('change')
    await nextTick()

    expect(options.original).toBe(false)

    const updatedCheckboxes = wrapper.findAll('input[type="checkbox"]')
    expect(updatedCheckboxes).toHaveLength(2)

    await updatedCheckboxes[1]!.trigger('change')
    await nextTick()

    expect(options.background).toBe(true)
    expect(wrapper.find('.n-color').exists()).toBe(true)
  })
})

describe('ChromeTabDarkNote', () => {
  it('renders title and description text', () => {
    const wrapper = mount(ChromeTabDarkNote)
    expect(wrapper.text()).toContain('Dark Theme SVG Icon Limitation')
    expect(wrapper.text()).toContain(
      'Due to the limitation of the browser, the SVG icon of the browser tab in dark theme may not be displayed correctly.',
    )
  })
})
