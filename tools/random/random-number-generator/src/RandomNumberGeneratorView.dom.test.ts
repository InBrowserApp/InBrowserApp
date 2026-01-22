import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref('blob:mock')
      watchEffect(() => {
        if (isRef(source)) {
          return void source.value
        }
        if (typeof source === 'function') {
          source()
        }
      })
      return url
    },
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import RandomNumberGeneratorView from './RandomNumberGeneratorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
      CopyToClipboardButton: {
        template: '<button />',
      },
      RegenerateButton: {
        template: '<button />',
      },
    },
  },
}

const getHeroNumber = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find('[data-testid="hero-number"]')

describe('RandomNumberGeneratorView', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('random-number-generator')
    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }
    expect(route.path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('generates numbers and applies presets', async () => {
    const wrapper = mount(RandomNumberGeneratorView, mountOptions)
    await flushPromises()

    expect(getHeroNumber(wrapper).text()).toBe('51')
    expect(wrapper.get('[data-testid="download-results"]').attributes('href')).toBe('blob:mock')

    await wrapper.get('[data-testid="preset-dice"]').trigger('click')
    await flushPromises()

    expect(getHeroNumber(wrapper).text()).toBe('4')
  })

  it('supports decimal output', async () => {
    localStorage.setItem('tools:random-number-generator:number-type', 'decimal')
    localStorage.setItem('tools:random-number-generator:decimal-places', '2')
    localStorage.setItem('tools:random-number-generator:min', '1')
    localStorage.setItem('tools:random-number-generator:max', '2')
    localStorage.setItem('tools:random-number-generator:count', '1')

    const wrapper = mount(RandomNumberGeneratorView, mountOptions)
    await flushPromises()

    expect(getHeroNumber(wrapper).text()).toBe('1.50')
  })

  it('shows a range error when min exceeds max', async () => {
    localStorage.setItem('tools:random-number-generator:min', '10')
    localStorage.setItem('tools:random-number-generator:max', '1')

    const wrapper = mount(RandomNumberGeneratorView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('Min must be less than or equal to Max.')
    expect(getHeroNumber(wrapper).exists()).toBe(false)
  })

  it('shows a count error when unique values are exhausted', async () => {
    localStorage.setItem('tools:random-number-generator:allow-repeat', 'false')
    localStorage.setItem('tools:random-number-generator:min', '1')
    localStorage.setItem('tools:random-number-generator:max', '3')
    localStorage.setItem('tools:random-number-generator:count', '4')

    const wrapper = mount(RandomNumberGeneratorView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('Count exceeds the number of unique values in the range (3).')
    expect(getHeroNumber(wrapper).exists()).toBe(false)
  })
})
