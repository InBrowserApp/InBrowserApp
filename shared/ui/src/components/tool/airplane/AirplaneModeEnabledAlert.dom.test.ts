import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AirplaneModeEnabledAlert from './AirplaneModeEnabledAlert.vue'

const state = vi.hoisted(() => ({
  airplaneModeStore: {
    isAirplaneMode: false,
  },
}))

vi.mock('@utils/airplane-mode', () => ({
  useAirplaneModeStore: () => state.airplaneModeStore,
}))

vi.mock('naive-ui', async () => {
  const NCollapseTransition = defineComponent({
    name: 'NCollapseTransition',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    template: '<div class="collapse" :data-show="show"><slot /></div>',
  })

  const NAlert = defineComponent({
    name: 'NAlert',
    props: {
      title: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'default',
      },
    },
    template:
      '<div class="alert" :data-title="title" :data-type="type"><slot name="icon" /><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="icon"><slot /></span>',
  })

  return {
    NCollapseTransition,
    NAlert,
    NIcon,
  }
})

function mountAlert() {
  return mount(AirplaneModeEnabledAlert, {
    global: {
      stubs: {
        EnableIcon: { template: '<i class="enabled-icon" />' },
      },
    },
  })
}

describe('AirplaneModeEnabledAlert', () => {
  beforeEach(() => {
    state.airplaneModeStore.isAirplaneMode = false
  })

  it('renders warning details and collapsed state when airplane mode is disabled', () => {
    const wrapper = mountAlert()

    expect(wrapper.get('.collapse').attributes('data-show')).toBe('false')
    expect(wrapper.get('.alert').attributes('data-title')).toBe('Airplane Mode Enabled')
    expect(wrapper.get('.alert').attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toContain(
      'When airplane mode is enabled, all network requests to external servers are blocked to ensure your data always stays on your device. Only requests within the same website (same origin) are allowed. Think of it as a privacy shield - your files and data never leave your browser, making our tools completely secure and private.',
    )
  })

  it('shows the alert when airplane mode is enabled', () => {
    state.airplaneModeStore.isAirplaneMode = true
    const wrapper = mountAlert()

    expect(wrapper.get('.collapse').attributes('data-show')).toBe('true')
  })
})
