import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import RadioTimecodeController from './RadioTimecodeController.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', () => ({
  useStorage: (_key: string, value: unknown) => ref(value),
}))

const startMock = vi.fn().mockResolvedValue(undefined)
const stopMock = vi.fn()

vi.mock('../audio/signalEngine', () => ({
  SignalEngine: class {
    start = startMock
    stop = stopMock
    setVolume = vi.fn()
  },
}))

describe('RadioTimecodeController', () => {
  it('renders controls and preview blocks', () => {
    const wrapper = mount(RadioTimecodeController, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
          NAlert: { template: '<div><slot /></div>' },
          NButton: { template: '<button><slot /></button>' },
          NFlex: { template: '<div><slot /></div>' },
          NGrid: { template: '<div><slot /></div>' },
          NGi: { template: '<div><slot /></div>' },
          NIcon: { template: '<span />' },
          NInputNumber: { template: '<input />' },
          NSelect: { template: '<select />' },
          NSlider: { template: '<input type="range" />' },
          NText: { template: '<span><slot /></span>' },
        },
      },
    })

    expect(wrapper.text()).toContain('controls')
    expect(wrapper.text()).toContain('preview')
  })
})
