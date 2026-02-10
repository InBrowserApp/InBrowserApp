import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ArchitectureInfo from './ArchitectureInfo.vue'
import BrowserName from './BrowserName.vue'
import PrimaryLanguage from './PrimaryLanguage.vue'
import BrowserLanguages from './BrowserLanguages.vue'
import CookieEnabled from './CookieEnabled.vue'
import PlatformInfo from './PlatformInfo.vue'
import UserAgent from './UserAgent.vue'
import TimezoneInfo from './TimezoneInfo.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const InfoStatisticStub = defineComponent({
  name: 'InfoStatistic',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  template: '<div class="info-stat" :data-label="label">{{ value ?? "" }}</div>',
})

const mountWithStub = (component: Parameters<typeof mount>[0]) =>
  mount(component, {
    global: {
      stubs: {
        InfoStatistic: InfoStatisticStub,
      },
    },
  })

const createNavigator = (overrides: Record<string, unknown> = {}) => ({
  userAgent: 'Mozilla/5.0 Chrome/115.0.0.0',
  language: 'en-US',
  languages: ['en-US', 'fr-CA'],
  cookieEnabled: true,
  platform: 'MacIntel',
  ...overrides,
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('browser components', () => {
  it.each([
    ['Chrome', 'Mozilla/5.0 Chrome/115.0.0.0'],
    ['Firefox', 'Mozilla/5.0 Firefox/115.0'],
    ['Safari', 'Mozilla/5.0 Safari/605.1.15'],
    ['Edge', 'Mozilla/5.0 Chrome/115.0 Edg/115.0'],
    ['unknown', 'CustomBrowser/1.0'],
  ])('detects %s from the user agent', (expected, userAgent) => {
    vi.stubGlobal('navigator', createNavigator({ userAgent }))
    const wrapper = mountWithStub(BrowserName)

    expect(wrapper.text()).toContain(expected)
  })

  it('renders the primary language', () => {
    vi.stubGlobal('navigator', createNavigator({ language: 'fr-CA' }))
    const wrapper = mountWithStub(PrimaryLanguage)

    expect(wrapper.text()).toContain('fr-CA')
  })

  it('renders architecture from user agent data', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'macOS',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => ({ architecture: 'arm64' }),
        },
      }),
    )

    const wrapper = mountWithStub(ArchitectureInfo)
    await flushPromises()

    expect(wrapper.text()).toContain('arm64')
  })

  it('returns empty architecture when user agent data is unavailable', async () => {
    vi.stubGlobal('navigator', createNavigator({ userAgentData: undefined }))
    const wrapper = mountWithStub(ArchitectureInfo)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('returns empty architecture when user agent data errors', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'macOS',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => {
            throw new Error('fail')
          },
        },
      }),
    )

    const wrapper = mountWithStub(ArchitectureInfo)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('renders the supported languages list', () => {
    vi.stubGlobal('navigator', createNavigator({ languages: ['en-US', 'de-DE'] }))
    const wrapper = mountWithStub(BrowserLanguages)

    expect(wrapper.text()).toContain('en-US, de-DE')
  })

  it.each([
    [true, 'yes'],
    [false, 'no'],
  ])('reports cookie enabled as %s', (cookieEnabled, expected) => {
    vi.stubGlobal('navigator', createNavigator({ cookieEnabled }))
    const wrapper = mountWithStub(CookieEnabled)

    expect(wrapper.text()).toContain(expected)
  })

  it('prefers platform from user agent data', () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        platform: 'MacIntel',
        userAgentData: {
          platform: 'Windows',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => ({}),
        },
      }),
    )

    const wrapper = mountWithStub(PlatformInfo)

    expect(wrapper.text()).toContain('Windows')
  })

  it('falls back to navigator platform', () => {
    vi.stubGlobal('navigator', createNavigator({ platform: 'Linux x86_64' }))
    const wrapper = mountWithStub(PlatformInfo)

    expect(wrapper.text()).toContain('Linux x86_64')
  })

  it('renders the user agent string', () => {
    vi.stubGlobal('navigator', createNavigator({ userAgent: 'Test UA' }))
    const wrapper = mountWithStub(UserAgent)

    expect(wrapper.text()).toContain('Test UA')
  })

  it('includes UTC in the timezone output', () => {
    vi.stubGlobal('navigator', createNavigator())
    const wrapper = mountWithStub(TimezoneInfo)

    expect(wrapper.text()).toContain('UTC')
  })

  it('formats negative timezone offsets', () => {
    const offsetSpy = vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(300)
    const tzSpy = vi
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: 'America/New_York' } as Intl.ResolvedDateTimeFormatOptions)

    const wrapper = mountWithStub(TimezoneInfo)

    expect(wrapper.text()).toContain('UTC-05:00')

    offsetSpy.mockRestore()
    tzSpy.mockRestore()
  })
})
