import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const getImageSizeMock = vi.fn()

vi.mock('@utils/image', () => ({
  getImageSize: (...args: unknown[]) => getImageSizeMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref('blob:mock'),
    computedAsync: (getter: () => Promise<unknown>) => {
      const state = ref<unknown>(undefined)
      watchEffect(() => {
        void Promise.resolve(getter()).then((value) => {
          state.value = value
        })
      })
      return state
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    emits: ['click'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  return {
    NButton,
    NP: Base,
    NIcon: Base,
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

import SelectFile from './SelectFile.vue'

const ImageUploadStub = {
  name: 'ImageUpload',
  emits: ['update:file'],
  template: '<div data-test="image-upload" />',
}

const RemoveButtonStub = {
  name: 'RemoveButton',
  emits: ['click'],
  template: '<button data-test="remove" @click="$emit(\'click\')">remove</button>',
}

const originalFetch = globalThis.fetch

describe('SelectFile', () => {
  beforeEach(() => {
    getImageSizeMock.mockReset()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('loads the demo icon and updates the image', async () => {
    const updateSpy = vi.fn()
    const demoBlob = new Blob(['demo'], { type: 'image/png' })

    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: async () => demoBlob,
    })

    const wrapper = mount(SelectFile, {
      props: {
        image: undefined,
        'onUpdate:image': updateSpy,
      },
      global: {
        stubs: {
          ImageUpload: ImageUploadStub,
          RemoveButton: RemoveButtonStub,
        },
      },
    })

    const button = wrapper.findAll('button').find((btn) => btn.text().includes('useDemoIcon'))
    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    expect(globalThis.fetch).toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalledWith(demoBlob)
  })

  it('shows image details and allows removal', async () => {
    const updateSpy = vi.fn()
    const imageBlob = new Blob(['icon'], { type: 'image/png' })

    getImageSizeMock.mockResolvedValue({ width: 64, height: 64 })

    const wrapper = mount(SelectFile, {
      props: {
        image: imageBlob,
        'onUpdate:image': updateSpy,
      },
      global: {
        stubs: {
          ImageUpload: ImageUploadStub,
          RemoveButton: RemoveButtonStub,
        },
      },
    })

    await flushPromises()

    const image = wrapper.find('img')
    expect(image.attributes('src')).toBe('blob:mock')
    expect(wrapper.text()).toContain('64x64')
    expect(getImageSizeMock).toHaveBeenCalledWith(imageBlob)

    const remove = wrapper.find('[data-test="remove"]')
    await remove.trigger('click')

    expect(updateSpy).toHaveBeenCalledWith(undefined)
  })

  it('accepts image updates from upload events', async () => {
    const updateSpy = vi.fn()
    const imageBlob = new Blob(['upload'], { type: 'image/png' })

    const wrapper = mount(SelectFile, {
      props: {
        image: undefined,
        'onUpdate:image': updateSpy,
      },
      global: {
        stubs: {
          ImageUpload: ImageUploadStub,
          RemoveButton: RemoveButtonStub,
        },
      },
    })

    wrapper.findComponent({ name: 'ImageUpload' }).vm.$emit('update:file', imageBlob)
    await flushPromises()

    expect(updateSpy).toHaveBeenCalledWith(imageBlob)
  })
})
