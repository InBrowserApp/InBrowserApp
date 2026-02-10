import { describe, expect, it, vi } from 'vitest'

const { removeOwnerPasswordMock } = vi.hoisted(() => ({
  removeOwnerPasswordMock: vi.fn(),
}))

vi.mock('./remove-owner-password-with-worker', () => ({
  removeOwnerPassword: removeOwnerPasswordMock,
}))

import { removePDFOwnerPassword } from './index'

describe('remove-pdf-owner-password index', () => {
  it('re-exports removeOwnerPassword with alias', () => {
    expect(removePDFOwnerPassword).toBe(removeOwnerPasswordMock)
  })
})
