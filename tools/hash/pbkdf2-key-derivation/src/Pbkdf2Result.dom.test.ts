import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { webcrypto } from 'node:crypto'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="clipboard"><slot :copy="() => {}" /></div>',
  },
}))

vi.mock('naive-ui', () => ({
  NDescriptions: {
    template: '<div class="descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    template: '<div class="descriptions-item"><slot /></div>',
  },
  NText: {
    template: '<span class="text"><slot /></span>',
  },
}))

let Pbkdf2Result: typeof import('./components/Pbkdf2Result.vue').default

beforeAll(async () => {
  const globalWithCrypto = globalThis as { crypto?: Crypto }
  if (globalWithCrypto.crypto !== webcrypto) {
    try {
      Object.defineProperty(globalWithCrypto, 'crypto', {
        value: webcrypto,
        configurable: true,
      })
    } catch {
      globalWithCrypto.crypto = webcrypto as Crypto
    }
  }

  Pbkdf2Result = (await import('./components/Pbkdf2Result.vue')).default
})

describe('Pbkdf2Result', () => {
  it('derives and renders the key output', async () => {
    const wrapper = mount(Pbkdf2Result, {
      props: {
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        algorithm: 'SHA-256',
        iterations: 1,
        length: 32,
        iterationsValid: true,
        lengthValid: true,
        saltErrorType: '',
      },
    })

    const expected = '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await flushPromises()
      if (wrapper.text().includes(expected)) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    expect(wrapper.text()).toContain(expected)
  })
})
