import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VATValidatorView from './VATValidatorView.vue'
import { routes } from './routes'
import { toolInfo } from './index'

const storageKey = 'tools:vat-validator:vat'

const VATInputStub = {
  name: 'VATInput',
  props: ['modelValue', 'validationResult'],
  emits: ['update:modelValue'],
  template: '<div class="vat-input" />',
}

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  VATInput: VATInputStub,
  VATResult: {
    props: ['validationResult'],
    template: '<div class="vat-result" />',
  },
  WhatIsVATValidator: {
    template: '<div class="vat-what-is" />',
  },
}

describe('VATValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the result when storage has a value', () => {
    localStorage.setItem(storageKey, 'BE 0123 4567 49')
    const wrapper = mount(VATValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.vat-input').exists()).toBe(true)
    expect(wrapper.find('.vat-result').exists()).toBe(true)
    expect(wrapper.find('.vat-what-is').exists()).toBe(true)
  })

  it('hides the result when the input is empty', () => {
    localStorage.setItem(storageKey, '')
    const wrapper = mount(VATValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.vat-input').exists()).toBe(true)
    expect(wrapper.find('.vat-result').exists()).toBe(false)
  })

  it('updates storage when the input emits updates', async () => {
    localStorage.setItem(storageKey, 'BE0123456749')
    const wrapper = mount(VATValidatorView, {
      global: {
        stubs,
      },
    })

    const input = wrapper.findComponent({ name: 'VATInput' })
    input.vm.$emit('update:modelValue', 'BE1234567890')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(storageKey)).toBe('BE1234567890')
  })

  it('loads the route component', async () => {
    const routeComponent = routes[0]?.component
    expect(routeComponent).toBeTypeOf('function')
    if (typeof routeComponent === 'function') {
      const module = await (routeComponent as () => Promise<unknown>)()
      expect(module).toBeTruthy()
    }
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('vat-validator')
    expect(routes[0]?.path).toBe('/tools/vat-validator')
  })
})
