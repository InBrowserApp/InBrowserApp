import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CopyToClipboardTooltip from './CopyToClipboardTooltip.vue'
const copySpy = vi.fn()
vi.mock('../../../composables/base/clipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copy: copySpy,
  }),
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NTooltip: defineComponent({
      name: 'NTooltip',
      template:
        '<div class="tooltip"><div class="trigger"><slot name="trigger" /></div><div class="content"><slot /></div></div>',
    }),
  }
})
describe('CopyToClipboardTooltip', () => {
  beforeEach(() => {
    copySpy.mockReset()
  })
  it('renders tooltip text and exposes copy to the trigger slot', async () => {
    const wrapper = mount(CopyToClipboardTooltip, {
      props: {
        content: 'value',
      },
      slots: {
        default: ({ copy }: { copy: () => void }) =>
          h(
            defineComponent({
              render() {
                return h('button', { class: 'copy-btn', onClick: copy }, 'copy')
              },
            }),
          ),
      },
    })
    expect(wrapper.text()).toContain('Copy to Clipboard')
    await wrapper.get('button.copy-btn').trigger('click')
    expect(copySpy).toHaveBeenCalledTimes(1)
  })
})
