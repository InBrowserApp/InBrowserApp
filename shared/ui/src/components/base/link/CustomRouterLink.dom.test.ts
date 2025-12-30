import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CustomRouterLink from './CustomRouterLink.vue'

const { prefetchSpy, localizedPath } = vi.hoisted(() => ({
  prefetchSpy: vi.fn(),
  localizedPath: { value: '/localized', __v_isRef: true },
}))

vi.mock('./use-prefetch-view', () => ({
  usePrefetchView: () => ({
    prefetch: prefetchSpy,
  }),
}))

vi.mock('./use-localized-path', () => ({
  useLocalizedPath: () => ({
    localizedPath,
  }),
}))

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      required: false,
    },
  },
  emits: ['mouseenter', 'touchstart'],
  setup(_props, { slots, emit }) {
    const navigate = vi.fn()
    const href = '/stub-href'
    return () =>
      h(
        'a',
        {
          class: 'router-link',
          onMouseenter: () => emit('mouseenter'),
          onTouchstart: () => emit('touchstart'),
        },
        slots.default?.({ navigate, href }),
      )
  },
})

describe('CustomRouterLink', () => {
  beforeEach(() => {
    prefetchSpy.mockClear()
  })

  it('should render slot content and use localized path', () => {
    const wrapper = mount(CustomRouterLink, {
      props: {
        to: '/original',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
      slots: {
        default: ({ href }) => h('span', { class: 'slot' }, href),
      },
    })

    expect(wrapper.find('.slot').text()).toBe('/stub-href')
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toBe('/localized')
  })

  it('should prefetch on mouseenter and touchstart', async () => {
    const wrapper = mount(CustomRouterLink, {
      props: {
        to: '/original',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
      slots: {
        default: () => 'Link',
      },
    })

    await wrapper.find('.router-link').trigger('mouseenter')
    await wrapper.find('.router-link').trigger('touchstart')

    expect(prefetchSpy).toHaveBeenCalledTimes(2)
  })
})
