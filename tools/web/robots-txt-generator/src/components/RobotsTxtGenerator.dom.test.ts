import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import RobotsTxtGenerator from './RobotsTxtGenerator.vue'
import { createGroup, createDefaultState } from '../robotsState'

const objectUrlState = vi.hoisted(() => ({
  value: 'blob:mock' as string | null,
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => computed(() => objectUrlState.value),
  }
})

const storageKey = 'tools:robots-txt-generator:state'

const RobotsTxtPresetsSectionStub = defineComponent({
  name: 'RobotsTxtPresetsSection',
  props: {
    onApplyPreset: {
      type: Function,
      required: true,
    },
  },
  template:
    '<div><button data-testid="preset-unknown" @click="onApplyPreset(\'unexpected\')" /><button data-testid="preset-disallow" @click="onApplyPreset(\'disallowAll\')" /></div>',
})

const RobotsTxtSiteSettingsSectionStub = defineComponent({
  name: 'RobotsTxtSiteSettingsSection',
  props: {
    sitemaps: {
      type: Array,
      default: () => [],
    },
    advanced: {
      type: Boolean,
      default: false,
    },
    host: {
      type: String,
      default: '',
    },
  },
  emits: ['update:sitemaps', 'update:advanced', 'update:host'],
  template:
    '<div class="site-settings" :data-sitemaps="sitemaps.length" :data-advanced="String(advanced)" :data-host="host" />',
})

const RobotsTxtGroupsSectionStub = defineComponent({
  name: 'RobotsTxtGroupsSection',
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
    advanced: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:groups'],
  template: '<div class="groups" :data-count="groups.length" :data-advanced="String(advanced)" />',
})

const RobotsTxtOutputSectionStub = defineComponent({
  name: 'RobotsTxtOutputSection',
  props: {
    robotsContent: {
      type: String,
      default: '',
    },
    hasOutput: {
      type: Boolean,
      default: false,
    },
    downloadHref: {
      type: String,
      default: undefined,
    },
  },
  template:
    '<div class="output" :data-content="robotsContent" :data-output="String(hasOutput)" :data-href="downloadHref" />',
})

describe('RobotsTxtGenerator', () => {
  beforeEach(() => {
    objectUrlState.value = 'blob:mock'
    localStorage.clear()
    localStorage.setItem(storageKey, JSON.stringify(createDefaultState()))
  })

  it('updates groups through v-model emits and ignores unknown presets', async () => {
    const wrapper = mount(RobotsTxtGenerator, {
      global: {
        stubs: {
          RobotsTxtPresetsSection: RobotsTxtPresetsSectionStub,
          RobotsTxtSiteSettingsSection: RobotsTxtSiteSettingsSectionStub,
          RobotsTxtGroupsSection: RobotsTxtGroupsSectionStub,
          RobotsTxtOutputSection: RobotsTxtOutputSectionStub,
        },
      },
    })

    await flushPromises()

    const groups = wrapper.getComponent(RobotsTxtGroupsSectionStub)
    const replacementGroups = [
      createGroup({
        userAgents: ['Googlebot'],
        rules: [{ type: 'disallow', path: '/private/' }],
      }),
    ]

    await groups.vm.$emit('update:groups', replacementGroups)
    await nextTick()

    const output = wrapper.get('.output')
    expect(output.attributes('data-content')).toContain('User-agent: Googlebot')
    expect(output.attributes('data-content')).toContain('Disallow: /private/')

    await wrapper.get('[data-testid="preset-unknown"]').trigger('click')
    await nextTick()

    expect(output.attributes('data-content')).toContain('Disallow: /private/')

    await wrapper.get('[data-testid="preset-disallow"]').trigger('click')
    await nextTick()

    expect(output.attributes('data-content')).toContain('Disallow: /')
  })

  it('renders allow directives and handles missing download urls', async () => {
    objectUrlState.value = null

    const wrapper = mount(RobotsTxtGenerator, {
      global: {
        stubs: {
          RobotsTxtPresetsSection: RobotsTxtPresetsSectionStub,
          RobotsTxtSiteSettingsSection: RobotsTxtSiteSettingsSectionStub,
          RobotsTxtGroupsSection: RobotsTxtGroupsSectionStub,
          RobotsTxtOutputSection: RobotsTxtOutputSectionStub,
        },
      },
    })

    await flushPromises()

    await wrapper.getComponent(RobotsTxtGroupsSectionStub).vm.$emit('update:groups', [
      createGroup({
        userAgents: [],
        rules: [{ type: 'allow', path: '/public/' }],
      }),
    ])
    await nextTick()

    const output = wrapper.get('.output')
    expect(output.attributes('data-content')).toContain('User-agent: *')
    expect(output.attributes('data-content')).toContain('Allow: /public/')
    expect(output.attributes('data-output')).toBe('true')
    expect(output.attributes('data-href')).toBeUndefined()
  })
})
