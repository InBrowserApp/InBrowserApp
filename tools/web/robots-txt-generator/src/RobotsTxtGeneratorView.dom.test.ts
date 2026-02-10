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
import { NButton, NDynamicInput, NInputNumber, NSwitch } from 'naive-ui'
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
        template: '<button data-testid="copy-robots" />',
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

  it('shows empty output state when no rules, groups, or sitemaps are provided', async () => {
    localStorage.setItem(
      stateKey,
      JSON.stringify({
        groups: [],
        sitemaps: [],
        host: '',
        advanced: false,
      }),
    )

    const wrapper = mountView()
    await flushPromises()

    expect(getOutput(wrapper)).toBe('')
    expect(wrapper.text()).toContain('No content to export yet.')
    expect(wrapper.find('[data-testid="copy-robots"]').exists()).toBe(false)

    const download = wrapper.get('[data-testid="download-robots"]')
    expect(download.attributes('href')).toBeUndefined()
    expect(download.attributes('disabled')).toBeDefined()
  })

  it('covers dynamic input creation, guard removal, and preset deduplication', async () => {
    const wrapper = mountView()
    await flushPromises()

    const removeButtons = wrapper
      .findAllComponents(NButton)
      .filter((button) => button.text().includes('Remove group'))
    await removeButtons[0]!.vm.$emit('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="group-card"]')).toHaveLength(1)

    const dynamicInputs = wrapper.findAllComponents(NDynamicInput)
    expect(dynamicInputs.length).toBeGreaterThanOrEqual(3)

    const createSitemap = dynamicInputs[0]!.props('onCreate') as () => string
    const createUserAgent = dynamicInputs[1]!.props('onCreate') as () => string
    const createRule = dynamicInputs[2]!.props('onCreate') as () => { type: string; path: string }

    expect(createSitemap()).toBe('')
    expect(createUserAgent()).toBe('')
    expect(createRule()).toEqual({ type: 'disallow', path: '' })

    await dynamicInputs[0]!.vm.$emit('update:value', [
      'https://example.com/sitemap.xml',
      ' https://example.com/new.xml ',
    ])
    await dynamicInputs[2]!.vm.$emit('update:value', [
      { type: 'disallow', path: '/admin/' },
      { type: 'disallow', path: '/tmp/' },
    ])
    await flushPromises()

    const advancedSwitch = wrapper.findComponent(NSwitch)
    await advancedSwitch.vm.$emit('update:value', true)
    await flushPromises()

    const hostInput = wrapper.get('[data-testid="host-input"]').find('input')
    await hostInput.setValue('   ')

    const crawlDelayInput = wrapper.findComponent(NInputNumber)
    await crawlDelayInput.vm.$emit('update:value', Number.NaN)
    await flushPromises()

    await dynamicInputs[1]!.vm.$emit('update:value', ['Googlebot'])
    await flushPromises()

    await wrapper.get('[data-testid="preset-useragent-search"]').trigger('click')
    await flushPromises()

    const output = getOutput(wrapper)
    expect((output.match(/User-agent: Googlebot/g) ?? []).length).toBe(1)
    expect(output).toContain('User-agent: Bingbot')
    expect(output).toContain('Disallow: /tmp/')
    expect(output).toContain('Sitemap: https://example.com/new.xml')
    expect(output).not.toContain('Host:')
    expect(output).not.toContain('Crawl-delay:')
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
