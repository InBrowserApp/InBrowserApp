import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AirplaneModeToggle from './AirplaneModeToggle.vue'

const state = vi.hoisted(() => ({
  airplaneModeStore: {
    isAirplaneMode: false,
    toggleAirplaneMode: vi.fn(),
  },
}))

vi.mock('@utils/airplane-mode', () => ({
  useAirplaneModeStore: () => state.airplaneModeStore,
}))

vi.mock('naive-ui', async () => {
  const NTooltip = defineComponent({
    name: 'NTooltip',
    template: '<div class="tooltip"><slot name="trigger" /><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      type: {
        type: String,
        default: undefined,
      },
      ariaLabel: {
        type: String,
        default: '',
      },
    },
    emits: ['click'],
    template:
      '<button :data-type="type" :aria-label="ariaLabel" @click="$emit(\'click\')"><slot name="icon" /></button>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="icon"><slot /></span>',
  })

  return {
    NTooltip,
    NButton,
    NIcon,
  }
})

function mountToggle() {
  return mount(AirplaneModeToggle, {
    global: {
      stubs: {
        enableIcon: { template: '<i class="enabled-icon" />' },
        disableIcon: { template: '<i class="disabled-icon" />' },
      },
    },
  })
}

describe('AirplaneModeToggle', () => {
  beforeEach(() => {
    state.airplaneModeStore.isAirplaneMode = false
    state.airplaneModeStore.toggleAirplaneMode.mockReset()
  })

  it('renders disabled airplane mode state and triggers toggle', async () => {
    const wrapper = mountToggle()

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Airplane Mode Disabled')
    expect(button.attributes('data-type')).toBe('tertiary')
    expect(wrapper.text()).toContain('Airplane Mode Disabled')

    await button.trigger('click')
    expect(state.airplaneModeStore.toggleAirplaneMode).toHaveBeenCalledTimes(1)
  })

  it('renders enabled airplane mode state', () => {
    state.airplaneModeStore.isAirplaneMode = true
    const wrapper = mountToggle()

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Airplane Mode Enabled')
    expect(button.attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toContain('Airplane Mode Enabled')
  })
})
