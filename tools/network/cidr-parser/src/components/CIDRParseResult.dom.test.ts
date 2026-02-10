import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CIDRParseResult from './CIDRParseResult.vue'

const { parseCidrMock, stringifyIpMock } = vi.hoisted(() => ({
  parseCidrMock: vi.fn(),
  stringifyIpMock: vi.fn(),
}))

vi.mock('cidr-tools', () => ({
  parseCidr: (...args: unknown[]) => parseCidrMock(...args),
}))

vi.mock('ip-bigint', () => ({
  stringifyIp: (...args: unknown[]) => stringifyIpMock(...args),
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

  const NDescriptions = defineComponent({
    name: 'NDescriptions',
    template: '<div class="n-descriptions"><slot /></div>',
  })

  const NDescriptionsItem = defineComponent({
    name: 'NDescriptionsItem',
    props: ['label'],
    template: '<div class="desc-item"><span class="label">{{ label }}</span><slot /></div>',
  })

  return {
    NDescriptions,
    NDescriptionsItem,
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')

  return {
    CopyToClipboardTooltip: defineComponent({
      name: 'CopyToClipboardTooltip',
      props: ['content'],
      template: '<span class="copy"><slot :copy="() => {}" /></span>',
    }),
  }
})

beforeEach(() => {
  parseCidrMock.mockReset()
  stringifyIpMock.mockReset()
})

function unwrapMaybeRef<T>(value: T | { value: T }): T {
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return value.value
  }

  return value
}

describe('CIDRParseResult', () => {
  it('renders parsed IPv4 details and netmask', () => {
    parseCidrMock.mockImplementation((cidr: string) => {
      if (cidr.startsWith('255.255.255.255/')) {
        return {
          version: 4,
          start: BigInt(4294967040),
          end: BigInt(4294967040),
          prefix: 24,
        }
      }
      return {
        version: 4,
        start: BigInt(1),
        end: BigInt(3),
        prefix: 24,
      }
    })

    stringifyIpMock.mockImplementation(({ number }: { number: bigint }) => `ip-${number}`)

    const wrapper = mount(CIDRParseResult, {
      props: {
        cidr: '192.168.0.0/24',
      },
    })

    expect(wrapper.find('.n-descriptions').exists()).toBe(true)
    expect(wrapper.text()).toContain('IPv4')
    expect(wrapper.text()).toContain('ip-1')
    expect(wrapper.text()).toContain('ip-3')
    expect(wrapper.text()).toContain('ip-4294967040')
    expect(wrapper.text()).toContain('3 (')
  })

  it('omits netmask for IPv6 results', () => {
    parseCidrMock.mockReturnValue({
      version: 6,
      start: BigInt(5),
      end: BigInt(5),
      prefix: 64,
    })

    stringifyIpMock.mockImplementation(({ number }: { number: bigint }) => `ip-${number}`)

    const wrapper = mount(CIDRParseResult, {
      props: {
        cidr: '2001:db8::/64',
      },
    })

    expect(wrapper.text()).toContain('IPv6')
    expect(wrapper.text()).toContain('ip-5')
    expect(wrapper.text()).not.toContain('netmask')
  })

  it('returns undefined derived values when cidr is missing', () => {
    const wrapper = mount(CIDRParseResult, {
      props: {
        cidr: undefined,
      },
    })

    const setupState =
      (wrapper.vm as { $?: { setupState?: Record<string, unknown> } }).$?.setupState ?? {}

    expect(wrapper.find('.n-descriptions').exists()).toBe(false)
    expect(unwrapMaybeRef(setupState.parsed as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.startIP as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.startIPInt as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.endIP as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.endIPInt as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.IPSize as { value: unknown } | undefined)).toBeUndefined()
    expect(unwrapMaybeRef(setupState.netmask as { value: unknown } | undefined)).toBeUndefined()
    expect(parseCidrMock).not.toHaveBeenCalled()
    expect(stringifyIpMock).not.toHaveBeenCalled()
  })

  it('returns empty output on parse errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    parseCidrMock.mockImplementation(() => {
      throw new Error('bad cidr')
    })

    const wrapper = mount(CIDRParseResult, {
      props: {
        cidr: 'invalid',
      },
    })

    expect(wrapper.find('.n-descriptions').exists()).toBe(false)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
