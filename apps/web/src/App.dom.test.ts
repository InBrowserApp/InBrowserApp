import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const osThemeRef = { value: 'dark' as 'dark' | 'light' | null }
const useSetSiteLanguage = vi.fn()

vi.mock('@shared/locale', () => ({
  useSetSiteLanguage,
}))

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
    useSetSiteLanguage.mockClear()
  })

  it('uses the dark theme when OS theme is dark', async () => {
    osThemeRef.value = 'dark'

    const App = (await import('./App.vue')).default
    const wrapper = mount(App)

    expect(wrapper.get('[data-test="config-provider"]').attributes('data-has-theme')).toBe('true')
    expect(useSetSiteLanguage).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-test="app-view"]').exists()).toBe(true)
  })

  it('uses no explicit theme when OS theme is not dark', async () => {
    osThemeRef.value = 'light'

    const App = (await import('./App.vue')).default
    const wrapper = mount(App)

    expect(wrapper.get('[data-test="config-provider"]').attributes('data-has-theme')).toBe('false')
  })
})
