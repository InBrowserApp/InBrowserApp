import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import StopwatchLapsSection from './StopwatchLapsSection.vue'

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL
let createdBlob: Blob | null = null

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  const translations: Record<string, string> = {
    laps: 'Laps',
    clear: 'Clear',
    export: 'Export',
    'no-laps': 'No laps yet',
    lap: 'Lap, "quoted"',
    total: 'Total\nline',
    'lap-ms': 'Lap (ms)',
    'total-ms': 'Total (ms)',
  }
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => translations[key] ?? key,
    }),
  }
})

const mountSection = (laps: number[]) =>
  mount(StopwatchLapsSection, {
    props: {
      laps,
    },
    global: {
      stubs: {
        ToolSection: {
          template: '<section><slot /></section>',
        },
        ToolSectionHeader: {
          template: '<header><slot /></header>',
        },
      },
    },
  })

describe('StopwatchLapsSection', () => {
  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob: Blob) => {
      createdBlob = blob
      return 'blob:laps'
    }) as typeof URL.createObjectURL
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('ignores clear action when there are no laps', async () => {
    const wrapper = mountSection([])

    await wrapper.get('[data-testid="clear-laps"]').trigger('click')

    expect(wrapper.emitted('update:laps')).toBeUndefined()
  })

  it('escapes csv headers and emits cleared laps', async () => {
    const wrapper = mountSection([1200, 2600])
    await nextTick()

    const exportButton = wrapper.get('[data-testid="export-csv"]')
    expect(exportButton.attributes('href')).toBe('blob:laps')
    expect(createdBlob).not.toBeNull()

    const csvText = await createdBlob!.text()
    expect(csvText).toContain('"Lap, ""quoted"""')
    expect(csvText).toContain('"Total\nline"')

    await wrapper.get('[data-testid="clear-laps"]').trigger('click')

    expect(wrapper.emitted('update:laps')).toEqual([[[]]])
  })
})
