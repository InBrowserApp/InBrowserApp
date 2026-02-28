import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'
import PWA from './PWA.vue'
import PWASettings from './any/PWASettings.vue'
import PWASettingsDisplay from './any/PWASettingsDisplay.vue'
import PWASettingsDedicatedImage from './any/PWASettingsDedicatedImage.vue'
import PWAMaskableSettings from './maskable/PWAMaskableSettings.vue'
import PWAMaskableSettingsDisplay from './maskable/PWAMaskableSettingsDisplay.vue'
import PWAMaskableSettingsDedicatedImage from './maskable/PWAMaskableSettingsDedicatedImage.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
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
        return value ? 'blob:pwa' : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div class="stub"><slot /><slot name="icon" /></div>',
  })

  const NH3 = defineComponent({
    name: 'NH3',
    inheritAttrs: false,
    template: '<h3 class="n-h3"><slot /></h3>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
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

  const NImage = defineComponent({
    name: 'NImage',
    props: { src: { type: String, default: '' } },
    template: '<img class="n-image" :data-src="src" />',
  })

  return {
    NH3,
    NText,
    NGrid,
    NGridItem,
    NIcon,
    NTabs,
    NTabPane,
    NCheckbox,
    NCollapseTransition,
    NFormItem,
    NColorPicker,
    NSlider,
    NP,
    NImage,
    NButton: Base,
  }
})

vi.mock('@vicons/ionicons5/LogoPwa', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'LogoPwa',
      template: '<span class="logo-pwa" />',
    }),
  }
})

vi.mock('@vicons/fluent/BookInformation20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'BookInformation',
      template: '<span class="book-info" />',
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

const baseOptions: PWAOptions = {
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 10,
  maskable: false,
  maskableBackgroundColor: '#000000',
  maskableMargin: 12,
  margin: 5,
}

describe('PWA', () => {
  it('renders preview and settings sections', () => {
    const PWAPreviewStub = {
      name: 'PWAPreview',
      props: ['image', 'options', 'generalInfoOptions'],
      template: '<div class="preview" />',
    }
    const PWAMaskablePreviewStub = {
      name: 'PWAMaskablePreview',
      props: ['image', 'options', 'generalInfoOptions'],
      template: '<div class="maskable-preview" />',
    }
    const PWASettingsStub = {
      name: 'PWASettings',
      props: ['image', 'options'],
      template: '<div class="settings" />',
    }
    const PWAMaskableSettingsStub = {
      name: 'PWAMaskableSettings',
      props: ['image', 'options'],
      template: '<div class="maskable-settings" />',
    }

    const wrapper = mount(PWA, {
      props: {
        image: undefined,
        generalInfoOptions,
        options: { ...baseOptions },
      },
      global: {
        stubs: {
          PWAPreview: PWAPreviewStub,
          PWAMaskablePreview: PWAMaskablePreviewStub,
          PWASettings: PWASettingsStub,
          PWAMaskableSettings: PWAMaskableSettingsStub,
          'i18n-t': {
            template: '<span class="i18n-t"><slot name="any" /><slot name="maskable" /></span>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Progressive Web App (PWA)')
    expect(wrapper.findComponent(PWAPreviewStub).props('generalInfoOptions')).toEqual(
      generalInfoOptions,
    )
    expect(wrapper.findComponent(PWAMaskableSettingsStub).props('options')).toEqual(baseOptions)
  })
})

describe('PWA', () => {
  it('forwards updates from both settings panels', async () => {
    const PWAPreviewStub = {
      name: 'PWAPreview',
      props: ['image', 'options', 'generalInfoOptions'],
      template: '<div class="preview" />',
    }
    const PWAMaskablePreviewStub = {
      name: 'PWAMaskablePreview',
      props: ['image', 'options', 'generalInfoOptions'],
      template: '<div class="maskable-preview" />',
    }
    const PWASettingsStub = {
      name: 'PWASettings',
      props: ['image', 'options'],
      emits: ['update:options'],
      template: '<div class="settings" />',
    }
    const PWAMaskableSettingsStub = {
      name: 'PWAMaskableSettings',
      props: ['image', 'options'],
      emits: ['update:options'],
      template: '<div class="maskable-settings" />',
    }

    const options = { ...baseOptions }
    const wrapper = mount(PWA, {
      props: {
        image: undefined,
        generalInfoOptions,
        options,
      },
      global: {
        stubs: {
          PWAPreview: PWAPreviewStub,
          PWAMaskablePreview: PWAMaskablePreviewStub,
          PWASettings: PWASettingsStub,
          PWAMaskableSettings: PWAMaskableSettingsStub,
          'i18n-t': {
            template: '<span class="i18n-t"><slot name="any" /><slot name="maskable" /></span>',
          },
        },
      },
    })

    const nextAnyOptions = { ...options, margin: 12 }
    const nextMaskableOptions = { ...options, maskableMargin: 20 }

    wrapper.findComponent(PWASettingsStub).vm.$emit('update:options', nextAnyOptions)
    wrapper.findComponent(PWAMaskableSettingsStub).vm.$emit('update:options', nextMaskableOptions)
    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([[nextAnyOptions], [nextMaskableOptions]])
  })
})

describe('PWASettings', () => {
  it('renders settings panes with props', async () => {
    const PWASettingsDisplayStub = {
      name: 'PWASettingsDisplay',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="display" />',
    }
    const PWASettingsDedicatedImageStub = {
      name: 'PWASettingsDedicatedImage',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="dedicated" />',
    }
    const PWASettingsDownloadStub = {
      name: 'PWASettingsDownload',
      props: ['options', 'image'],
      template: '<div class="download" />',
    }

    const options = { ...baseOptions }

    const wrapper = mount(PWASettings, {
      props: {
        image: undefined,
        options,
      },
      global: {
        stubs: {
          PWASettingsDisplay: PWASettingsDisplayStub,
          PWASettingsDedicatedImage: PWASettingsDedicatedImageStub,
          PWASettingsDownload: PWASettingsDownloadStub,
        },
      },
    })

    expect(wrapper.findComponent(PWASettingsDisplayStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(PWASettingsDedicatedImageStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(PWASettingsDownloadStub).props('image')).toBeUndefined()

    const nextDisplayOptions = { ...options, margin: 18 }
    const nextDedicatedOptions = { ...options, image: new Blob(['icon'], { type: 'image/png' }) }

    wrapper.findComponent(PWASettingsDisplayStub).vm.$emit('update:options', nextDisplayOptions)
    wrapper
      .findComponent(PWASettingsDedicatedImageStub)
      .vm.$emit('update:options', nextDedicatedOptions)

    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([
      [nextDisplayOptions],
      [nextDedicatedOptions],
    ])
  })
})

describe('PWASettingsDisplay', () => {
  it('shows background settings when enabled', async () => {
    const options: PWAOptions = {
      ...baseOptions,
      background: false,
    }

    const wrapper = mount(PWASettingsDisplay, {
      props: { options },
    })

    expect(wrapper.find('.n-color').exists()).toBe(false)

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')
    await nextTick()

    expect(options.background).toBe(true)
    expect(wrapper.find('.n-color').exists()).toBe(true)
  })
})

describe('PWASettingsDedicatedImage', () => {
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

    const options: PWAOptions = {
      ...baseOptions,
      image: undefined,
    }

    const wrapper = mount(PWASettingsDedicatedImage, {
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

    const imageBlob = new Blob(['icon'], { type: 'image/png' })
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', imageBlob)
    await nextTick()

    expect(options.image).toBe(imageBlob)
    expect(wrapper.find('.n-image').attributes('data-src')).toBe('blob:pwa')

    await wrapper.find('.remove').trigger('click')
    await nextTick()

    expect(options.image).toBeUndefined()
    expect(wrapper.find('.not-using').exists()).toBe(true)
  })
})

describe('PWAMaskableSettings', () => {
  it('renders maskable settings panes', async () => {
    const PWAMaskableSettingsDisplayStub = {
      name: 'PWAMaskableSettingsDisplay',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="display" />',
    }
    const PWAMaskableSettingsDedicatedImageStub = {
      name: 'PWAMaskableSettingsDedicatedImage',
      props: ['options'],
      emits: ['update:options'],
      template: '<div class="dedicated" />',
    }
    const PWAMaskableSettingsDownloadStub = {
      name: 'PWAMaskableSettingsDownload',
      props: ['options', 'image'],
      template: '<div class="download" />',
    }

    const options = { ...baseOptions }

    const wrapper = mount(PWAMaskableSettings, {
      props: {
        image: undefined,
        options,
      },
      global: {
        stubs: {
          PWAMaskableSettingsDisplay: PWAMaskableSettingsDisplayStub,
          PWAMaskableSettingsDedicatedImage: PWAMaskableSettingsDedicatedImageStub,
          PWAMaskableSettingsDownload: PWAMaskableSettingsDownloadStub,
        },
      },
    })

    expect(wrapper.findComponent(PWAMaskableSettingsDisplayStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(PWAMaskableSettingsDedicatedImageStub).props('options')).toEqual(
      options,
    )

    const nextDisplayOptions = { ...options, maskableMargin: 16 }
    const nextDedicatedOptions = {
      ...options,
      maskableImage: new Blob(['icon'], { type: 'image/png' }),
    }

    wrapper
      .findComponent(PWAMaskableSettingsDisplayStub)
      .vm.$emit('update:options', nextDisplayOptions)
    wrapper
      .findComponent(PWAMaskableSettingsDedicatedImageStub)
      .vm.$emit('update:options', nextDedicatedOptions)

    await nextTick()

    expect(wrapper.emitted('update:options')).toEqual([
      [nextDisplayOptions],
      [nextDedicatedOptions],
    ])
  })
})

describe('PWAMaskableSettingsDisplay', () => {
  it('renders maskable background controls', () => {
    const wrapper = mount(PWAMaskableSettingsDisplay, {
      props: {
        options: { ...baseOptions },
      },
    })

    const formItems = wrapper.findAllComponents({ name: 'NFormItem' })
    expect(formItems).toHaveLength(2)
    expect(formItems.map((item) => item.props('label'))).toEqual(['Background Color', 'Margin'])
  })
})

describe('PWAMaskableSettingsDedicatedImage', () => {
  it('toggles maskable dedicated image rendering', async () => {
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

    const options: PWAOptions = {
      ...baseOptions,
      maskableImage: undefined,
    }

    const wrapper = mount(PWAMaskableSettingsDedicatedImage, {
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

    const imageBlob = new Blob(['icon'], { type: 'image/png' })
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', imageBlob)
    await nextTick()

    expect(options.maskableImage).toBe(imageBlob)
    expect(wrapper.find('.n-image').attributes('data-src')).toBe('blob:pwa')

    await wrapper.find('.remove').trigger('click')
    await nextTick()

    expect(options.maskableImage).toBeUndefined()
    expect(wrapper.find('.not-using').exists()).toBe(true)
  })
})
