import { describe, expect, it, vi } from 'vitest'

const { removePDFOwnerPasswordMock } = vi.hoisted(() => ({
  removePDFOwnerPasswordMock: vi.fn(),
}))

vi.mock('./remove-pdf-owner-password', () => ({
  removePDFOwnerPassword: removePDFOwnerPasswordMock,
}))

import { removePDFOwnerPassword } from './index'

describe('pdf utils index', () => {
  it('re-exports removePDFOwnerPassword from remove-pdf-owner-password', () => {
    expect(removePDFOwnerPassword).toBe(removePDFOwnerPasswordMock)
  })
})
