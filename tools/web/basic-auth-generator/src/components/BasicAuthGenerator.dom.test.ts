import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import BasicAuthGenerator from './BasicAuthGenerator.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:value'],
  template:
    '<input class="n-input" :type="type" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
})

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="clipboard"><slot :copy="() => {}" /></div>',
  },
  NInput: NInputStub,
  NGrid: {
    template: '<div class="grid"><slot /></div>',
  },
  NGi: {
    template: '<div class="grid-item"><slot /></div>',
  },
  NText: {
    template: '<span class="text"><slot /></span>',
  },
}

const originalBtoa = globalThis.btoa

beforeAll(() => {
  if (!globalThis.btoa) {
    globalThis.btoa = (value: string) => Buffer.from(value, 'binary').toString('base64')
  }
})

afterAll(() => {
  const globalWithBtoa = globalThis as { btoa?: typeof globalThis.btoa }
  globalWithBtoa.btoa = originalBtoa
})

describe('BasicAuthGenerator', () => {
  it('renders the auth header and curl command from inputs', async () => {
    const wrapper = mount(BasicAuthGenerator, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    await inputs[0]!.setValue('user')
    await inputs[1]!.setValue('pass')

    const base64 = Buffer.from('user:pass', 'utf-8').toString('base64')
    const header = `Basic ${base64}`
    const curl = `curl -H "Authorization: ${header}" https://api.example.com`

    expect(wrapper.text()).toContain(header)
    expect(wrapper.text()).toContain(curl)
  })

  it('shows empty outputs when encoder returns an empty token', async () => {
    const previousBtoa = globalThis.btoa
    globalThis.btoa = () => ''

    try {
      const wrapper = mount(BasicAuthGenerator, {
        global: {
          stubs,
        },
      })

      const inputs = wrapper.findAll('input')
      expect(inputs).toHaveLength(2)
      await inputs[0]!.setValue('user')
      await inputs[1]!.setValue('pass')

      expect(wrapper.text()).not.toContain('Basic ')
      expect(wrapper.text()).not.toContain('curl -H "Authorization:')
    } finally {
      globalThis.btoa = previousBtoa
    }
  })
})
