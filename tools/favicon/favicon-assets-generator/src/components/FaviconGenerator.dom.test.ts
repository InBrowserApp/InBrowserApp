import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import FaviconGenerator from './FaviconGenerator.vue'

const createModelStub = (name: string, propName: string) =>
  defineComponent({
    name,
    props: {
      [propName]: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: [`update:${propName}`],
    template: '<div />',
  })

const SelectFileStub = defineComponent({
  name: 'SelectFile',
  props: {
    image: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['update:image'],
  template: '<div />',
})

const GeneralInfoStub = createModelStub('GeneralInfo', 'options')
const DesktopBrowserStub = defineComponent({
  name: 'DesktopBrowser',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    image: {
      type: Object,
      default: undefined,
    },
    generalInfoOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:options'],
  template: '<div />',
})

const IOSWebClipStub = defineComponent({
  name: 'IOSWebClip',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    image: {
      type: Object,
      default: undefined,
    },
    generalInfoOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:options'],
  template: '<div />',
})

const PWAStub = defineComponent({
  name: 'PWA',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    image: {
      type: Object,
      default: undefined,
    },
    generalInfoOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:options'],
  template: '<div />',
})

const GenerateAssetsStub = defineComponent({
  name: 'GenerateAssets',
  props: {
    image: {
      type: Object,
      default: undefined,
    },
    iosWebClipOptions: {
      type: Object,
      default: () => ({}),
    },
    desktopBrowserOptions: {
      type: Object,
      default: () => ({}),
    },
    pwaOptions: {
      type: Object,
      default: () => ({}),
    },
    generalInfoOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div />',
})

const mountGenerator = () =>
  mount(FaviconGenerator, {
    global: {
      stubs: {
        SelectFile: SelectFileStub,
        GeneralInfo: GeneralInfoStub,
        DesktopBrowser: DesktopBrowserStub,
        IOSWebClip: IOSWebClipStub,
        PWA: PWAStub,
        GenerateAssets: GenerateAssetsStub,
      },
    },
  })

describe('FaviconGenerator', () => {
  it('passes default options to child sections', () => {
    const wrapper = mountGenerator()
    const generalInfo = wrapper.findComponent({ name: 'GeneralInfo' })
    const desktop = wrapper.findComponent({ name: 'DesktopBrowser' })
    const pwa = wrapper.findComponent({ name: 'PWA' })

    expect(generalInfo.props('options')).toEqual(
      expect.objectContaining({
        name: 'App',
        short_name: 'App',
      }),
    )
    expect(desktop.props('options')).toEqual(
      expect.objectContaining({
        original: true,
        background: false,
      }),
    )
    expect(pwa.props('options')).toEqual(
      expect.objectContaining({
        maskable: true,
      }),
    )
  })

  it('propagates image and option updates to dependent sections', async () => {
    const wrapper = mountGenerator()
    const selectFile = wrapper.findComponent({ name: 'SelectFile' })
    const generalInfo = wrapper.findComponent({ name: 'GeneralInfo' })

    const imageBlob = new Blob(['icon'], { type: 'image/png' })
    selectFile.vm.$emit('update:image', imageBlob)

    const nextInfo = {
      ...generalInfo.props('options'),
      name: 'Next App',
    }
    generalInfo.vm.$emit('update:options', nextInfo)

    await nextTick()

    const desktop = wrapper.findComponent({ name: 'DesktopBrowser' })
    const ios = wrapper.findComponent({ name: 'IOSWebClip' })
    const generate = wrapper.findComponent({ name: 'GenerateAssets' })

    expect(desktop.props('image')).toBeInstanceOf(Blob)
    expect(ios.props('image')).toBeInstanceOf(Blob)
    expect(generate.props('image')).toBeInstanceOf(Blob)
    expect((generate.props('image') as Blob).type).toBe('image/png')
    expect(generate.props('generalInfoOptions')).toEqual(nextInfo)
  })
})
