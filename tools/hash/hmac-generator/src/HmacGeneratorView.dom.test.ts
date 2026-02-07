import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import HmacGeneratorView from './HmacGeneratorView.vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const HmacFormStub = defineComponent({
  name: 'HmacForm',
  props: {
    secretKey: {
      type: String,
      default: '',
    },
    algorithm: {
      type: String,
      default: '',
    },
    message: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['update:secretKey', 'update:algorithm', 'update:message'],
  template:
    '<div class="hmac-form" :data-secret="secretKey" :data-algorithm="algorithm" :data-message="String(message)" />',
})

const HmacResultStub = defineComponent({
  name: 'HmacResult',
  props: {
    secretKey: {
      type: String,
      default: '',
    },
    algorithm: {
      type: String,
      default: '',
    },
    message: {
      type: [String, Object],
      default: '',
    },
  },
  template:
    '<div class="hmac-result" :data-secret="secretKey" :data-algorithm="algorithm" :data-message="String(message)" />',
})

const mountView = () =>
  mount(HmacGeneratorView, {
    global: {
      stubs: {
        ToolDefaultPageLayout: {
          props: ['info'],
          template: '<div class="layout"><slot /></div>',
        },
        HmacForm: HmacFormStub,
        HmacResult: HmacResultStub,
        WhatIsHmac: {
          template: '<div class="what-is" />',
        },
      },
    },
  })

describe('HmacGeneratorView', () => {
  it('passes stored state to child components', () => {
    const wrapper = mountView()

    const form = wrapper.find('.hmac-form')
    const result = wrapper.find('.hmac-result')

    expect(form.attributes('data-secret')).toBe('')
    expect(form.attributes('data-algorithm')).toBe('SHA-256')
    expect(form.attributes('data-message')).toBe('')

    expect(result.attributes('data-secret')).toBe('')
    expect(result.attributes('data-algorithm')).toBe('SHA-256')
    expect(result.attributes('data-message')).toBe('')

    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('syncs v-model updates from the form to the result', async () => {
    const wrapper = mountView()
    const form = wrapper.getComponent(HmacFormStub)

    await form.vm.$emit('update:secretKey', 'my-secret')
    await form.vm.$emit('update:algorithm', 'SHA-512')
    await form.vm.$emit('update:message', 'updated message')

    const result = wrapper.get('.hmac-result')
    expect(result.attributes('data-secret')).toBe('my-secret')
    expect(result.attributes('data-algorithm')).toBe('SHA-512')
    expect(result.attributes('data-message')).toBe('updated message')
  })
})
