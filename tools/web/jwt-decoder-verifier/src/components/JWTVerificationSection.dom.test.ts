import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import JWTVerificationSection from './JWTVerificationSection.vue'

const verifyMock = vi.fn()

vi.mock('hono/jwt', () => ({
  verify: (...args: unknown[]) => verifyMock(...args),
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
    props: {
      type: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      showIcon: {
        type: Boolean,
        default: false,
      },
    },
    template: '<div data-testid="alert" :data-type="type" :data-title="title"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      depth: {
        type: String,
        default: '',
      },
    },
    template: '<span data-testid="text"><slot /></span>',
  })

  return { NAlert, NText }
})

const mountSection = (props: {
  token: string
  secret: string
  alg: 'auto' | 'HS256'
  decodedHeader: object | null
}) =>
  mount(JWTVerificationSection, {
    props,
    global: {
      stubs: {
        ToolSectionHeader: {
          template: '<h2><slot /></h2>',
        },
        ToolSection: {
          template: '<section><slot /></section>',
        },
      },
    },
  })

describe('JWTVerificationSection', () => {
  beforeEach(() => {
    verifyMock.mockReset()
    verifyMock.mockResolvedValue(undefined)
  })

  it('shows default status when token is missing', async () => {
    const wrapper = mountSection({
      token: '',
      secret: 'secret',
      alg: 'HS256',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('default')
    expect(alert.props('title')).toBe('decoded-only')
    expect(wrapper.text()).toContain('enter-token')
    expect(wrapper.text()).not.toContain('problems')
  })

  it('computes decoded-only values when secret is missing', async () => {
    const wrapper = mountSection({
      token: 'token',
      secret: '',
      alg: 'HS256',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    expect(verifyMock).not.toHaveBeenCalled()
    expect(wrapper.findComponent({ name: 'NAlert' }).exists()).toBe(false)

    const vm = wrapper.vm as unknown as {
      statusType: string
      statusTitle: string
      statusDetail: string
    }
    expect(vm.statusType).toBe('default')
    expect(vm.statusTitle).toBe('decoded-only')
    expect(vm.statusDetail).toBe('enter-secret')
  })

  it('reports missing algorithm when auto mode cannot detect one', async () => {
    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'auto',
      decodedHeader: {},
    })
    await flushPromises()

    expect(verifyMock).not.toHaveBeenCalled()
    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('error')
    expect(alert.props('title')).toBe('failed')
    expect(wrapper.text()).toContain('no-alg')
    expect(wrapper.findAll('li')).toHaveLength(1)
  })

  it('verifies using detected algorithm in auto mode', async () => {
    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'auto',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    expect(verifyMock).toHaveBeenCalledWith('token', 'secret', 'HS256')
    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('success')
    expect(alert.props('title')).toBe('verified')
  })

  it('reports missing algorithm when detected alg is not a string', async () => {
    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'auto',
      decodedHeader: { alg: 123 },
    })
    await flushPromises()

    expect(verifyMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('no-alg')
  })

  it('verifies a token when algorithm is provided', async () => {
    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'HS256',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    expect(verifyMock).toHaveBeenCalledWith('token', 'secret', 'HS256')
    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('success')
    expect(alert.props('title')).toBe('verified')
    expect(wrapper.text()).toContain('ok')
  })

  it('stringifies non-Error verification failures', async () => {
    verifyMock.mockRejectedValueOnce('bad signature')

    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'HS256',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('error')
    expect(alert.props('title')).toBe('failed')
    expect(wrapper.text()).toContain('bad signature')
  })

  it('surfaces verification errors', async () => {
    verifyMock.mockRejectedValueOnce(new Error('bad signature'))

    const wrapper = mountSection({
      token: 'token',
      secret: 'secret',
      alg: 'HS256',
      decodedHeader: { alg: 'HS256' },
    })
    await flushPromises()

    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.props('type')).toBe('error')
    expect(alert.props('title')).toBe('failed')
    expect(wrapper.text()).toContain('bad signature')
    expect(wrapper.findAll('li')).toHaveLength(1)
  })
})
