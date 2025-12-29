import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toContainText('All Tools')
})

test('can navigate to a tool page', async ({ page }) => {
  await page.goto('/')
  // Click on the first tool card
  await page.locator('.tool-link').first().click()
  // Should navigate to a tool page
  await expect(page).toHaveURL(/\/tools\//)
})
