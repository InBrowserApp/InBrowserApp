import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GradientStopsTrack from './GradientStopsTrack.vue'

const createRect = () =>
  ({
    x: 0,
    y: 0,
    width: 200,
    height: 32,
    top: 0,
    left: 0,
    right: 200,
    bottom: 32,
    toJSON: () => '',
  }) as DOMRect

describe('GradientStopsTrack', () => {
  it('emits add when clicking the track', async () => {
    const wrapper = mount(GradientStopsTrack, {
      props: {
        stops: [
          { id: 'a', color: '#FF0000FF', position: 0 },
          { id: 'b', color: '#00FF00FF', position: 100 },
        ],
        activeStopId: 'a',
        gradientCss: 'linear-gradient(#000, #fff)',
      },
    })

    const track = wrapper.get('[data-testid="stops-track"]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue(createRect())

    await track.trigger('click', { clientX: 100 })

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual([50])
  })

  it('emits zero when track bounds are unavailable', async () => {
    const wrapper = mount(GradientStopsTrack, {
      props: {
        stops: [{ id: 'a', color: '#FF0000FF', position: 0 }],
        activeStopId: 'a',
        gradientCss: 'linear-gradient(#000, #fff)',
      },
    })

    const track = wrapper.get('[data-testid="stops-track"]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue(
      undefined as unknown as DOMRect,
    )

    await track.trigger('click', { clientX: 100 })

    expect(wrapper.emitted('add')?.[0]).toEqual([0])
  })

  it('emits select when clicking a stop handle', async () => {
    const wrapper = mount(GradientStopsTrack, {
      props: {
        stops: [{ id: 'a', color: '#FF0000FF', position: 10 }],
        activeStopId: null,
        gradientCss: 'linear-gradient(#000, #fff)',
      },
    })

    await wrapper.get('[data-testid="stop-handle"]').trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual(['a'])
  })

  it('emits select and update while dragging a stop', async () => {
    const wrapper = mount(GradientStopsTrack, {
      props: {
        stops: [
          { id: 'a', color: '#FF0000FF', position: 10 },
          { id: 'b', color: '#00FF00FF', position: 90 },
        ],
        activeStopId: 'a',
        gradientCss: 'linear-gradient(#000, #fff)',
      },
    })

    const track = wrapper.get('[data-testid="stops-track"]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue(createRect())

    const handle = wrapper.get('[data-testid="stop-handle"]')
    await handle.trigger('pointerdown', { clientX: 10 })

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 150 }))
    window.dispatchEvent(new MouseEvent('pointerup'))

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('update')).toBeTruthy()
    const lastUpdate = wrapper.emitted('update')?.slice(-1)[0]
    expect(lastUpdate?.[0]).toBe('a')
    expect(lastUpdate?.[1]).toBeGreaterThan(0)
  })
})
