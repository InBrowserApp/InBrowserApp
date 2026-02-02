import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CurrentNetworkTimeView from './CurrentNetworkTimeView.vue'

const state = {
  status: ref<'syncing' | 'synced' | 'error'>('synced'),
  error: ref<string | null>(null),
  networkTime: ref<number | undefined>(undefined),
  localTime: ref(0),
  roundTripTimeMs: ref(0),
  offset: ref<number | undefined>(undefined),
  lastSyncAt: ref(0),
}

vi.mock('./composables/useNetworkTime', () => ({
  useNetworkTime: () => state,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NAlert = defineComponent({
    name: 'NAlert',
    props: ['type', 'title'],
    template: '<div class="n-alert"><span class="alert-title">{{ title }}</span><slot /></div>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NTime = defineComponent({
    name: 'NTime',
    props: ['time', 'format'],
    template: '<span class="n-time">{{ time }}</span>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  const NBadge = defineComponent({
    name: 'NBadge',
    template: '<span class="n-badge" />',
  })

  const NSkeleton = defineComponent({
    name: 'NSkeleton',
    template: '<span class="n-skeleton" />',
  })

  return {
    NAlert,
    NFlex,
    NTime,
    NText,
    NBadge,
    NSkeleton,
    useThemeVars: () => ({ bodyColor: '#fff' }),
  }
})

const layoutStubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
}

describe('CurrentNetworkTimeView', () => {
  beforeEach(() => {
    state.status.value = 'synced'
    state.error.value = null
    state.networkTime.value = 1000
    state.localTime.value = 2000
    state.roundTripTimeMs.value = 0
    state.offset.value = undefined
    state.lastSyncAt.value = 0
  })

  it('renders error and offset details', () => {
    state.error.value = 'Network error'
    state.offset.value = 123.4
    state.roundTripTimeMs.value = 56.7
    state.lastSyncAt.value = 1700000000000

    const wrapper = mount(CurrentNetworkTimeView, {
      global: {
        stubs: layoutStubs,
      },
    })

    expect(wrapper.find('.n-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('errorTitle')
    expect(wrapper.text()).toContain('Network error')
    expect(wrapper.text()).toContain('offset')
    expect(wrapper.text()).toContain('123 ms (±57 ms)')
    expect(wrapper.findAll('.n-skeleton')).toHaveLength(0)
  })

  it('shows syncing badge and skeletons when data is missing', () => {
    state.status.value = 'syncing'
    state.offset.value = undefined
    state.lastSyncAt.value = 0

    const wrapper = mount(CurrentNetworkTimeView, {
      global: {
        stubs: layoutStubs,
      },
    })

    expect(wrapper.find('.n-badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('syncing')
    expect(wrapper.findAll('.n-skeleton').length).toBeGreaterThan(0)
  })

  it('toggles fullscreen on click', async () => {
    const wrapper = mount(CurrentNetworkTimeView, {
      global: {
        stubs: layoutStubs,
      },
    })

    const flexes = wrapper.findAll('.n-flex')
    const clickable = flexes[0]

    expect(clickable?.classes()).not.toContain('fullscreen')
    await clickable?.trigger('click')
    expect(clickable?.classes()).toContain('fullscreen')
    await clickable?.trigger('click')
    expect(clickable?.classes()).not.toContain('fullscreen')
  })
})
