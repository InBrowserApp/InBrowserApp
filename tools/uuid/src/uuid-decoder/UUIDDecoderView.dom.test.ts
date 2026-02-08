import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'
import UUIDDecoderView from './UUIDDecoderView.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())
const routeParams = vi.hoisted(() => ({ uuid: 'uuid-from-route' }))
const validateMock = vi.hoisted(() => vi.fn())

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<unknown>
    },
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: routeParams }),
}))

vi.mock('uuid', () => ({
  validate: (...args: unknown[]) => validateMock(...args),
}))

vi.mock('@shared/ui/domain/uuid', async () => {
  const { defineComponent } = await import('vue')
  return {
    UUIDInput: defineComponent({
      name: 'UUIDInput',
      props: {
        uuid: {
          type: String,
          default: '',
        },
      },
      template: '<input class="uuid-input" :value="uuid" />',
    }),
  }
})

describe('UUIDDecoderView', () => {
  beforeEach(() => {
    storage.clear()
    validateMock.mockReset()
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'uuid-default'),
    })
  })

  it('uses a valid UUID from the route', async () => {
    routeParams.uuid = 'uuid-from-route'
    validateMock.mockReturnValue(true)

    const wrapper = mount(UUIDDecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          UUIDDecoderResult: {
            props: ['uuid'],
            template: '<div class="decoder-result" />',
          },
          WhatIsUUID: { template: '<div />' },
        },
      },
    })

    await nextTick()
    const input = wrapper.find('.uuid-input')
    expect((input.element as HTMLInputElement).value).toBe('uuid-from-route')

    wrapper.findComponent({ name: 'UUIDInput' }).vm.$emit('update:uuid', 'uuid-updated')
    await nextTick()

    const stored = storage.get('tools:uuid-decoder:uuid') as Ref<string>
    expect(stored.value).toBe('uuid-updated')
  })

  it('falls back to stored UUID when the route is invalid', async () => {
    routeParams.uuid = 'not-valid'
    validateMock.mockReturnValue(false)

    const wrapper = mount(UUIDDecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          UUIDDecoderResult: {
            props: ['uuid'],
            template: '<div class="decoder-result" />',
          },
          WhatIsUUID: { template: '<div />' },
        },
      },
    })

    await nextTick()
    const input = wrapper.find('.uuid-input')
    expect((input.element as HTMLInputElement).value).toBe('uuid-default')
  })
})
