import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const osThemeRef = { value: 'dark' as 'dark' | 'light' | null }
const routeState = reactive({ path: '/en/tools' })

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => routeState,
  }
})

const makeSlotStub = (name: string, extraProps: Record<string, unknown> = {}) =>
  defineComponent({
    name,
    props: Object.fromEntries(Object.keys(extraProps).map((key) => [key, null])),
    setup(props, { slots }) {
      return () => h('div', { 'data-test': name, ...extraProps, ...props }, slots.default?.())
    },
  })

vi.mock('naive-ui', () => ({
  useOsTheme: () => osThemeRef,
  darkTheme: { name: 'dark-theme' },
  NConfigProvider: defineComponent({
    name: 'NConfigProvider',
    props: {
      theme: null,
    },
    setup(props, { slots }) {
      return () =>
        h(
          'div',
          {
            'data-test': 'config-provider',
            'data-has-theme': String(props.theme !== null),
          },
          slots.default?.(),
        )
    },
  }),
  NGlobalStyle: makeSlotStub('NGlobalStyle'),
  NLoadingBarProvider: makeSlotStub('NLoadingBarProvider'),
  NMessageProvider: makeSlotStub('NMessageProvider'),
  NNotificationProvider: makeSlotStub('NNotificationProvider'),
}))

vi.mock('./AppView.vue', () => ({
  default: {
    name: 'AppView',
    template: '<div data-test="app-view" />',
  },
}))

describe('App', () => {
  beforeEach(() => {
    routeState.path = '/en/tools'
    document.documentElement.lang = ''
    window.history.replaceState({}, '', '/en/tools')
  })

  it('uses the dark theme when OS theme is dark', async () => {
    osThemeRef.value = 'dark'

    const App = (await import('./App.vue')).default
    const wrapper = mount(App)
    await nextTick()

    expect(wrapper.get('[data-test="config-provider"]').attributes('data-has-theme')).toBe('true')
    expect(document.documentElement.lang).toBe('en')
    expect(wrapper.find('[data-test="app-view"]').exists()).toBe(true)
  })

  it('uses no explicit theme when OS theme is not dark', async () => {
    osThemeRef.value = 'light'

    const App = (await import('./App.vue')).default
    const wrapper = mount(App)

    expect(wrapper.get('[data-test="config-provider"]').attributes('data-has-theme')).toBe('false')
  })
})
