import { beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="copy-tooltip" :data-content="content"><slot :copy="() => {}" /></div>',
  },
}))

vi.mock('naive-ui', () => ({
  NDescriptions: {
    template: '<div class="n-descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    template: '<div class="n-descriptions-item"><slot /></div>',
  },
  NText: {
    inheritAttrs: false,
    template: '<span class="n-text" v-bind="$attrs"><slot /></span>',
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

let HashResult: typeof import('./HashResult.vue').default

beforeAll(async () => {
  HashResult = (await import('./HashResult.vue')).default
})

const hashBuffer = new Uint8Array([0, 1, 2, 255]).buffer

describe('HashResult', () => {
  it('renders hash outputs for string content', async () => {
    const hash = vi.fn(async () => hashBuffer)
    const wrapper = mount(HashResult, {
      props: {
        hash,
        content: 'hello',
      },
    })

    await flushPromises()

    const values = wrapper.findAll('.hash-result').map((node) => node.text())
    expect(values).toEqual(['000102ff', 'AAEC/w==', '66303', '00000000000000010000001011111111'])
    expect(hash).toHaveBeenCalled()
  })

  it('hides sections based on flags', async () => {
    const hash = vi.fn(async () => hashBuffer)
    const wrapper = mount(HashResult, {
      props: {
        hash,
        content: 'hello',
        hideBase64: true,
        hideBinary: true,
      },
    })

    await flushPromises()

    const values = wrapper.findAll('.hash-result').map((node) => node.text())
    expect(values).toEqual(['000102ff', '66303'])
  })

  it('passes file content directly to the hash function', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    const hash = vi.fn(async () => hashBuffer)

    mount(HashResult, {
      props: {
        hash,
        content: file,
      },
    })

    await flushPromises()

    expect(hash).toHaveBeenCalledWith(file)
  })
})
