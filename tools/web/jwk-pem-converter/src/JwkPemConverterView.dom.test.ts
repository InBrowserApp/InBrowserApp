import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')
  return {
    ...actual,
    useDebounce: (value: unknown) => value,
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

vi.mock('./utils/jwkPem', async () => {
  const actual = await vi.importActual<typeof import('./utils/jwkPem')>('./utils/jwkPem')
  return {
    ...actual,
    pemToJwk: vi.fn(actual.pemToJwk),
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import { NMessageProvider, NRadioGroup, NSelect, NSwitch, NTabs } from 'naive-ui'
import { h, type Component } from 'vue'
import JwkPemConverterView from './JwkPemConverterView.vue'
import JwkPemConverter from './components/JwkPemConverter.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'
import * as jwkPemUtils from './utils/jwkPem'
import { TextOrFileInput } from '@shared/ui/base'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
    },
  },
}

const withMessageProvider = (component: Component, props?: Record<string, unknown>) => ({
  render() {
    return h(NMessageProvider, () => h(component, props))
  },
})

describe('JwkPemConverter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('jwk-pem-converter')
    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }
    expect(route.path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('renders default JWK conversion output', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    await flushPromises()

    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkOutput: string
      jwkError: string
    }
    expect(vm.jwkError).toBe('')
    expect(vm.jwkOutput).toContain('BEGIN PRIVATE KEY')
  })

  it('updates download name for public output', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    await flushPromises()

    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkOutputType: string
      jwkDownloadName: string
      jwkOutput: string
    }

    vm.jwkOutputType = 'public'
    await flushPromises()

    expect(vm.jwkDownloadName).toBe('public-key.pem')
    expect(vm.jwkOutput).toContain('BEGIN PUBLIC KEY')
  })

  it('handles empty input states', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkOutput: string
      jwkInputStatus?: string
      pemInput: string
      pemInputStatus?: string
    }

    vm.jwkInput = ''
    vm.pemInput = ''
    await flushPromises()

    expect(vm.jwkOutput).toBe('')
    expect(vm.jwkInputStatus).toBeUndefined()
    expect(vm.pemInputStatus).toBeUndefined()
  })

  it('handles invalid JWK input errors', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkError: string
    }
    vm.jwkInput = '{'
    await flushPromises()

    expect(vm.jwkError).toContain('Invalid JSON')
  })

  it('handles conversion errors for unsupported key types', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkError: string
    }
    vm.jwkInput = '{"kty":"oct","k":"abc"}'
    await flushPromises()

    expect(vm.jwkError).toContain('Unsupported')
  })

  it('shows warnings when unsupported PEM blocks are present', async () => {
    localStorage.setItem('tools:jwk-pem-converter:tab', 'pem')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string
      pemWarnings: string[]
      pemOutput: string
    }

    vm.pemInput = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
AAECAw==
-----END CERTIFICATE-----`

    await flushPromises()

    expect(vm.pemOutput).toContain('"kty"')
    expect(vm.pemWarnings.length).toBeGreaterThan(0)
  })

  it('parses JWK Sets and lists multiple keys', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkKeyOptions: Array<{ label: string; value: number }>
    }

    vm.jwkInput = JSON.stringify({
      keys: [
        {
          kty: 'OKP',
          crv: 'Ed25519',
          x: 'cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE',
          d: 'IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4',
          kid: 'key-1',
        },
        {
          kty: 'OKP',
          crv: 'Ed25519',
          x: 'cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE',
          d: 'IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4',
          kid: 'key-2',
        },
      ],
    })

    await flushPromises()

    expect(vm.jwkKeyOptions).toHaveLength(2)
    expect(vm.jwkKeyOptions[0]?.label).toContain('key-1')
  })

  it('uses fallback labels for keys without metadata', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkKeyOptions: Array<{ label: string; value: number }>
    }

    vm.jwkInput = JSON.stringify({
      keys: [
        {
          crv: 'Ed25519',
          x: 'cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE',
          d: 'IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4',
        },
      ],
    })

    await flushPromises()

    expect(vm.jwkKeyOptions[0]?.label).toContain('Key')
    expect(vm.jwkKeyOptions[0]?.label).toContain('#1')
  })

  it('omits curve detail when missing', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkKeyOptions: Array<{ label: string; value: number }>
    }

    vm.jwkInput = JSON.stringify({
      keys: [
        {
          kty: 'RSA',
          kid: 'key-1',
          n: 'a',
          e: 'b',
        },
      ],
    })

    await flushPromises()

    expect(vm.jwkKeyOptions[0]?.label).toBe('RSA (key-1)')
  })

  it('handles empty key selections', async () => {
    const parseSpy = vi.spyOn(jwkPemUtils, 'parseJwkJson').mockReturnValue([])
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string
      jwkOutput: string
      jwkError: string
    }

    vm.jwkInput = '{"keys":[{}]}'
    await flushPromises()

    expect(vm.jwkOutput).toBe('')
    expect(vm.jwkError).toBe('')

    parseSpy.mockRestore()
  })

  it('does not persist JWK file inputs', async () => {
    localStorage.setItem('tools:jwk-pem-converter:jwk-input', 'persisted')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      jwkInput: string | File
    }
    const file = new File(['{"kty":"OKP"}'], 'key.jwk', { type: 'application/json' })

    vm.jwkInput = file
    await flushPromises()

    expect(localStorage.getItem('tools:jwk-pem-converter:jwk-input')).toBe('persisted')
  })

  it('updates v-model bindings from input components', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    await flushPromises()

    const initialInputs = wrapper.findAllComponents(TextOrFileInput)
    const jwkInput = initialInputs[0]
    if (!jwkInput) {
      throw new Error('Missing JWK input')
    }

    jwkInput.vm.$emit(
      'update:value',
      JSON.stringify({
        keys: [
          {
            kty: 'OKP',
            crv: 'Ed25519',
            x: 'cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE',
            d: 'IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4',
          },
          {
            kty: 'OKP',
            crv: 'Ed25519',
            x: 'cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE',
            d: 'IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4',
          },
        ],
      }),
    )
    await flushPromises()

    const select = wrapper.findComponent(NSelect)
    if (!select.exists()) {
      throw new Error('Missing key selector')
    }
    select.vm.$emit('update:value', 1)
    await flushPromises()

    const radio = wrapper.findComponent(NRadioGroup)
    if (!radio.exists()) {
      throw new Error('Missing output type selector')
    }
    radio.vm.$emit('update:value', 'public')
    await flushPromises()

    const tabs = wrapper.findComponent(NTabs)
    if (!tabs.exists()) {
      throw new Error('Missing tabs')
    }
    tabs.vm.$emit('update:value', 'pem')
    await flushPromises()

    const pemInputs = wrapper.findAllComponents(TextOrFileInput)
    const pemInput = pemInputs[pemInputs.length - 1]
    if (!pemInput) {
      throw new Error('Missing PEM input')
    }
    pemInput.vm.$emit(
      'update:value',
      `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`,
    )
    await flushPromises()

    const switchComponent = wrapper.findComponent(NSwitch)
    if (!switchComponent.exists()) {
      throw new Error('Missing pretty JSON toggle')
    }
    switchComponent.vm.$emit('update:value', false)
    await flushPromises()

    const updatedVm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      activeTab: string
      jwkOutputType: string
      prettyJson: boolean
      selectedJwkIndex: number
    }
    expect(updatedVm.activeTab).toBe('pem')
    expect(updatedVm.jwkOutputType).toBe('public')
    expect(updatedVm.prettyJson).toBe(false)
    expect(updatedVm.selectedJwkIndex).toBe(1)
  })

  it('reads PEM input from files', async () => {
    localStorage.setItem('tools:jwk-pem-converter:tab', 'pem')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string | File
      pemOutput: string
    }
    const file = new File(
      [
        '-----BEGIN PRIVATE KEY-----\n',
        'MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke\n',
        '-----END PRIVATE KEY-----\n',
      ],
      'key.pem',
      { type: 'text/plain' },
    )

    vm.pemInput = file
    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await flushPromises()

    expect(vm.pemOutput).toContain('"kty"')
  })

  it('renders PEM output with compact JSON', async () => {
    localStorage.setItem('tools:jwk-pem-converter:tab', 'pem')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string
      pemOutput: string
      pemDownloadName: string
      prettyJson: boolean
    }

    vm.prettyJson = false
    vm.pemInput = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`

    await flushPromises()

    expect(vm.pemOutput).toContain('"kty"')
    expect(vm.pemOutput).not.toContain('\n  "kty"')
    expect(vm.pemDownloadName).toBe('key.jwk.json')
  })

  it('sets PEM status to success for valid input', async () => {
    localStorage.setItem('tools:jwk-pem-converter:tab', 'pem')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string
      pemInputStatus?: string
      pemError: string
    }

    vm.pemInput = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`

    await flushPromises()

    expect(vm.pemInputStatus).toBe('success')
    expect(vm.pemError).toBe('')
  })

  it('reports invalid PEM input errors', async () => {
    localStorage.setItem('tools:jwk-pem-converter:tab', 'pem')
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string
      pemInputStatus?: string
      pemError: string
    }

    vm.pemInput = 'not a pem block'
    await flushPromises()

    expect(vm.pemInputStatus).toBe('error')
    expect(vm.pemError).toContain('No valid PEM blocks')
  })

  it('surfaces non-JWK errors from PEM conversion', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverter), mountOptions)
    const vm = wrapper.findComponent(JwkPemConverter).vm as unknown as {
      pemInput: string
      pemError: string
    }

    const pemToJwkMock = vi.mocked(jwkPemUtils.pemToJwk)
    vm.pemInput = ''
    await flushPromises()
    pemToJwkMock.mockClear()

    pemToJwkMock.mockRejectedValueOnce(new Error('Boom'))
    vm.pemInput = '-----BEGIN PRIVATE KEY-----\ninvalid\n-----END PRIVATE KEY-----'

    await flushPromises()
    expect(vm.pemError).toBe('Boom')

    pemToJwkMock.mockRejectedValueOnce('Oops')
    vm.pemInput = '-----BEGIN PRIVATE KEY-----\ninvalid-2\n-----END PRIVATE KEY-----'

    await flushPromises()
    expect(vm.pemError).toBe('Oops')
  })

  it('renders the view layout', async () => {
    const wrapper = mount(withMessageProvider(JwkPemConverterView), mountOptions)
    await flushPromises()
    expect(wrapper.text()).toContain('JWK')
  })
})
