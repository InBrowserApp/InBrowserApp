import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LanguageMenuIcon from './LanguageMenuIcon.vue'

const state = vi.hoisted(() => ({
  pushSpy: vi.fn(),
  routeState: { path: '/en/tools/demo', fullPath: '/en/tools/demo' },
}))

vi.mock('vue-router', () => ({
  useRoute: () => state.routeState,
  useRouter: () => ({ push: state.pushSpy }),
}))

vi.mock('naive-ui', async () => {
  const NPopselect = defineComponent({
    name: 'NPopselect',
    props: {
      value: {
        type: [String, Number, Array, Object],
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="popselect" :data-value="String(value)"><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      ariaLabel: {
        type: String,
        default: '',
      },
    },
    template: '<button :aria-label="ariaLabel"><slot name="icon" /><slot /></button>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="icon"><slot /></span>',
  })

  return {
    NPopselect,
    NButton,
    NIcon,
  }
})

describe('LanguageMenuIcon', () => {
  beforeEach(() => {
    state.pushSpy.mockReset()
    state.routeState.path = '/en/tools/demo'
    state.routeState.fullPath = '/en/tools/demo'
  })

  it('uses auto as fallback when language is not set', () => {
    state.routeState.path = '/tools/demo'
    state.routeState.fullPath = '/tools/demo'
    const wrapper = mount(LanguageMenuIcon, {
      global: {
        stubs: {
          Icon: { template: '<i />' },
        },
      },
    })

    expect(wrapper.get('.popselect').attributes('data-value')).toBe('auto')
  })

  it('updates route prefixes when selecting auto or a specific language', () => {
    const wrapper = mount(LanguageMenuIcon, {
      global: {
        stubs: {
          Icon: { template: '<i />' },
        },
      },
    })

    const popselect = wrapper.getComponent({ name: 'NPopselect' })

    popselect.vm.$emit('update:value', 'auto')
    expect(state.pushSpy).toHaveBeenCalledWith({ path: '/tools/demo', force: true })

    state.routeState.fullPath = '/tools/demo'
    state.routeState.path = '/tools/demo'
    popselect.vm.$emit('update:value', 'auto')
    expect(state.pushSpy).toHaveBeenCalledWith({ path: '/tools/demo', force: true })

    state.routeState.fullPath = '/tools/demo'
    state.routeState.path = '/tools/demo'
    popselect.vm.$emit('update:value', 'zh')
    expect(state.pushSpy).toHaveBeenCalledWith({ path: '/zh/tools/demo', force: true })

    state.routeState.fullPath = '/en/tools/demo'
    state.routeState.path = '/en/tools/demo'
    popselect.vm.$emit('update:value', 'fr')
    expect(state.pushSpy).toHaveBeenCalledWith({ path: '/fr/tools/demo', force: true })
  })
})
