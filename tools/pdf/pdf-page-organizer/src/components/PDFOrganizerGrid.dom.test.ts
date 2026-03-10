import { NCheckbox } from 'naive-ui'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sortableEmitters = {
  end: vi.fn(),
}
const scrollIntoViewMock = vi.fn()

vi.mock('sortablejs-vue3', () => ({
  Sortable: defineComponent({
    props: ['list'],
    emits: ['end'],
    setup(props, { attrs, emit, slots }) {
      sortableEmitters.end.mockImplementation((payload: unknown) => emit('end', payload))
      return () =>
        h(
          'div',
          { ...attrs, class: ['sortable-stub', attrs.class] },
          props.list.map((element: unknown, index: number) => slots.item?.({ element, index })),
        )
    },
  }),
}))

import PDFOrganizerGrid from './PDFOrganizerGrid.vue'

describe('PDFOrganizerGrid', () => {
  beforeEach(() => {
    sortableEmitters.end.mockReset()
    scrollIntoViewMock.mockReset()
    vi.useFakeTimers()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits page actions and reorder events', async () => {
    const wrapper = mount(PDFOrganizerGrid, {
      props: {
        pages: [
          {
            id: '1',
            sourcePageNumber: 1,
            originalRotation: 0,
            rotationOffset: 0,
            thumbnailUrl: 'blob:1',
            isLoading: false,
            hasError: false,
          },
          {
            id: '2',
            sourcePageNumber: 2,
            originalRotation: 90,
            rotationOffset: 90,
            thumbnailUrl: null,
            isLoading: false,
            hasError: true,
          },
        ],
        selectedPageSet: new Set(['1']),
        isLoadingDocument: false,
        isRenderingThumbnails: true,
        thumbnailSize: 'large',
      },
    })

    await wrapper.getComponent(NCheckbox).trigger('click', { shiftKey: true })
    await wrapper.get('.page-card__preview').trigger('click')
    const clickButton = async (cardIndex: number, label: string) => {
      const card = wrapper.findAll('article')[cardIndex]
      const button = card?.find(`button[aria-label="${label}"]`)
      const resolvedButton = button?.exists()
        ? button
        : card?.findAll('button').find((item) => item.text() === label)
      expect(resolvedButton, `missing button ${label}`).toBeTruthy()
      await resolvedButton?.trigger('click')
    }

    await clickButton(1, 'Move up')
    await clickButton(0, 'Move down')
    await clickButton(1, 'Rotate left')
    await clickButton(1, 'Rotate right')
    await clickButton(1, 'Delete')

    sortableEmitters.end({ oldIndex: 0, newIndex: 1 })

    expect(wrapper.emitted('toggle-page')?.[0]).toEqual(['1', true])
    expect(wrapper.emitted('open-preview')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('move-up')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('move-down')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('rotate-left')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('rotate-right')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('delete-page')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('reorder')?.[0]).toEqual([0, 1])
    expect(wrapper.text()).toContain('Rendering page previews in the background')
    expect(wrapper.get('.sortable-stub').classes()).toContain('pages-grid--large')
  })

  it('exposes scrollToPage and highlights the target card', async () => {
    const wrapper = mount(PDFOrganizerGrid, {
      props: {
        pages: [
          {
            id: '1',
            sourcePageNumber: 1,
            originalRotation: 0,
            rotationOffset: 0,
            thumbnailUrl: 'blob:1',
            isLoading: false,
            hasError: false,
          },
          {
            id: '2',
            sourcePageNumber: 2,
            originalRotation: 0,
            rotationOffset: 0,
            thumbnailUrl: 'blob:2',
            isLoading: false,
            hasError: false,
          },
        ],
        selectedPageSet: new Set<string>(),
        isLoadingDocument: false,
        isRenderingThumbnails: false,
        thumbnailSize: 'compact',
      },
    })

    const exposed = wrapper.vm as unknown as { scrollToPage: (pageId: string) => boolean }
    expect(exposed.scrollToPage('2')).toBe(true)
    expect(scrollIntoViewMock).toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-page-id="2"]').classes()).toContain('page-card--highlighted')

    sortableEmitters.end({})
    expect(wrapper.emitted('reorder')?.[0]).toEqual([null, null])

    expect(exposed.scrollToPage('2')).toBe(true)
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-page-id="2"]').classes()).not.toContain('page-card--highlighted')

    await wrapper.setProps({ pages: [] })
    expect(wrapper.text()).toContain('Upload a PDF to start organizing pages')
    expect(exposed.scrollToPage('missing')).toBe(false)
    wrapper.unmount()
  })
})
