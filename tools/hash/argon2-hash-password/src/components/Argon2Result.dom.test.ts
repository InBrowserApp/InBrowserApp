import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const generateArgon2HashMock = vi.fn(async () => '$argon2id$hash')

vi.mock('../utils', () => ({
  generateArgon2Hash: generateArgon2HashMock,
}))

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
    template: '<div class="copy-tooltip"><slot :copy="() => {}" /></div>',
  },
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy-button" />',
  },
}))

vi.mock('naive-ui', () => ({
  NFormItem: {
    props: ['label'],
    template: '<label class="form-item"><slot /></label>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
}))

let Argon2Result: typeof import('./Argon2Result.vue').default

beforeAll(async () => {
  Argon2Result = (await import('./Argon2Result.vue')).default
})

beforeEach(() => {
  generateArgon2HashMock.mockClear()
})

describe('Argon2Result', () => {
  it('generates and renders encoded hash', async () => {
    const wrapper = mount(Argon2Result, {
      props: {
        password: 'secret',
        secret: '',
        algorithm: 'argon2id',
        salt: 'AQID',
        iterations: 3,
        memorySize: 512,
        parallelism: 1,
        hashLength: 32,
        configValid: true,
      },
    })

    await flushPromises()

    expect(generateArgon2HashMock).toHaveBeenCalledWith(
      expect.objectContaining({
        algorithm: 'argon2id',
        password: 'secret',
        salt: 'AQID',
      }),
    )
    expect(wrapper.find('.argon2-result').text()).toContain('$argon2id$hash')
    expect(wrapper.find('.copy-button').exists()).toBe(true)
  })

  it('shows pending state while hash is generating', async () => {
    vi.useFakeTimers()

    try {
      generateArgon2HashMock.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve('$argon2id$later'), 50)
          }),
      )

      const wrapper = mount(Argon2Result, {
        props: {
          password: 'secret',
          secret: '',
          algorithm: 'argon2id',
          salt: 'AQID',
          iterations: 3,
          memorySize: 512,
          parallelism: 1,
          hashLength: 32,
          configValid: true,
        },
      })

      await Promise.resolve()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.argon2-result').text()).toContain('...')
      expect(wrapper.find('.argon2-result').classes()).toContain('argon2-result-processing')

      await vi.advanceTimersByTimeAsync(50)
      await flushPromises()

      expect(wrapper.find('.argon2-result').text()).toContain('$argon2id$later')
      expect(wrapper.find('.argon2-result').classes()).not.toContain('argon2-result-processing')
    } finally {
      vi.useRealTimers()
    }
  })

  it('hides output when input is incomplete', async () => {
    const wrapper = mount(Argon2Result, {
      props: {
        password: '',
        secret: '',
        algorithm: 'argon2id',
        salt: 'AQID',
        iterations: 3,
        memorySize: 512,
        parallelism: 1,
        hashLength: 32,
        configValid: true,
      },
    })

    await flushPromises()

    expect(generateArgon2HashMock).not.toHaveBeenCalled()
    expect(wrapper.find('.section-header').exists()).toBe(false)
  })

  it('hides output when config is invalid', async () => {
    const wrapper = mount(Argon2Result, {
      props: {
        password: 'secret',
        secret: '',
        algorithm: 'argon2id',
        salt: 'AQID',
        iterations: 3,
        memorySize: 512,
        parallelism: 1,
        hashLength: 32,
        configValid: false,
      },
    })

    await flushPromises()

    expect(generateArgon2HashMock).not.toHaveBeenCalled()
    expect(wrapper.find('.section-header').exists()).toBe(false)
  })

  it('shows error text when hash generation fails', async () => {
    generateArgon2HashMock.mockRejectedValueOnce(new Error('boom'))

    const wrapper = mount(Argon2Result, {
      props: {
        password: 'secret',
        secret: '',
        algorithm: 'argon2id',
        salt: 'AQID',
        iterations: 3,
        memorySize: 512,
        parallelism: 1,
        hashLength: 32,
        configValid: true,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Failed to generate Argon2 hash.')
  })
})
