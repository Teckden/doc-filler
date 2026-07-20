import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { enlist } from '../support/e2eHelpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await enlist(page)
})

test('tracks fill progress', async ({ page }) => {
  await page.getByPlaceholder('clientName').fill('Taras Shevchenko')
  await expect(page.getByText('1 of 3 filled')).toBeVisible()
  await page.getByPlaceholder('amount').fill('1200')
  await page.getByPlaceholder('dueDate').fill('2026-08-01')
  await expect(page.getByText('3 of 3 filled')).toBeVisible()
})

test('clears all fields after confirmation', async ({ page }) => {
  await page.getByPlaceholder('clientName').fill('Lesia')
  await page.getByRole('button', { name: en.clear.button }).click()
  await expect(page.getByText(en.clear.title)).toBeVisible()
  await page.getByRole('button', { name: en.clear.confirm }).click()
  await expect(page.getByPlaceholder('clientName')).toHaveValue('')
  await expect(page.getByText('0 of 3 filled')).toBeVisible()
})

test('shows the live preview', async ({ page }) => {
  await page.getByRole('button', { name: en.preview.show }).click()
  await expect(page.getByText(en.preview.title)).toBeVisible()
  await expect(page.getByText(en.preview.exportReady)).toBeVisible()
})
