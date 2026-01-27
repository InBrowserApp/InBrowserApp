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
import { NInputNumber, NSwitch } from 'naive-ui'
import RobotsTxtGeneratorView from './RobotsTxtGeneratorView.vue'
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
    },
  },
}

const stateKey = 'tools:robots-txt-generator:state'

const createDefaultState = () => ({
  groups: [
    {
      id: 'group-0',
      userAgents: ['*'],
      rules: [{ type: 'disallow', path: '/admin/' }],
      crawlDelay: null,
    },
  ],
  sitemaps: ['https://example.com/sitemap.xml'],
  host: '',
  advanced: false,
})

const getOutput = (wrapper: ReturnType<typeof mount>) =>
  (wrapper.get('[data-testid="robots-output"]').find('textarea').element as HTMLTextAreaElement)
    .value

describe('RobotsTxtGeneratorView', () => {
  let wrapper: ReturnType<typeof mount> | null = null

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(stateKey, JSON.stringify(createDefaultState()))
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
  })

  const mountView = () => {
    wrapper = mount(RobotsTxtGeneratorView, mountOptions)
    return wrapper
  }

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('robots-txt-generator')
    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }
    expect(route.path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('generates output and updates advanced fields', async () => {
    const wrapper = mountView()
    await flushPromises()

    const initialOutput = getOutput(wrapper)
    expect(initialOutput).toContain('User-agent: *')
    expect(initialOutput).toContain('Disallow: /admin/')
    expect(initialOutput).toContain('Sitemap: https://example.com/sitemap.xml')

    await wrapper.get('[data-testid="rule-path-0-0"]').find('input').setValue('/private/')
    await wrapper
      .get('[data-testid="sitemap-input-0"]')
      .find('input')
      .setValue('https://example.com/sitemap-1.xml')

    const advancedSwitch = wrapper.findComponent(NSwitch)
    await advancedSwitch.vm.$emit('update:value', true)
    await flushPromises()

    await wrapper.get('[data-testid="host-input"]').find('input').setValue('example.com')
    const crawlDelayInput = wrapper.findComponent(NInputNumber)
    await crawlDelayInput.vm.$emit('update:value', 5)
    await flushPromises()

    const updatedOutput = getOutput(wrapper)
    expect(updatedOutput).toContain('Host: example.com')
    expect(updatedOutput).toContain('Disallow: /private/')
    expect(updatedOutput).toContain('Crawl-delay: 5')
    expect(updatedOutput).toContain('Sitemap: https://example.com/sitemap-1.xml')

    expect(wrapper.get('[data-testid="download-robots"]').attributes('href')).toBe('blob:mock')
  })

  it('adds user-agent presets', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-testid="preset-useragent-search"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('User-agent: Googlebot')

    await wrapper.get('[data-testid="preset-useragent-ai"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('User-agent: GPTBot')
  })

  it('applies presets and manages groups', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-testid="preset-disallow-all"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('Disallow: /')

    await wrapper.get('[data-testid="preset-allow-all"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('User-agent: *')
    expect(getOutput(wrapper)).not.toContain('Disallow:')

    await wrapper.get('[data-testid="preset-block-admin"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('Disallow: /admin/')

    await wrapper.get('[data-testid="add-group"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="group-card"]').length).toBe(2)

    const removeButtons = wrapper
      .findAll('button')
      .filter((button) => button.text().includes('Remove group') && !button.attributes('disabled'))

    expect(removeButtons.length).toBeGreaterThan(0)
    await removeButtons[0]!.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-testid="group-card"]').length).toBe(1)
  })
})
