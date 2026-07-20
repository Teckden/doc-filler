import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { enlist, exportDocument, FIXTURES, INVOICE_FIELDS } from '../support/e2eHelpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('uploads a first template and builds the form', async ({ page }) => {
  await expect(page.getByText(en.empty.title)).toBeVisible()
  await enlist(page)
  await expect(page.getByRole('heading', { name: en.workspace.title })).toBeVisible()
  for (const field of INVOICE_FIELDS) {
    await expect(page.getByPlaceholder(field)).toBeVisible()
  }
  await expect(page.getByText('0 of 3 filled')).toBeVisible()
})

test('accepts a template with no fields', async ({ page }) => {
  await enlist(page, FIXTURES.noFields)
  await expect(page.getByText(en.workspace.noFields)).toBeVisible()
  const download = await exportDocument(page)
  expect(download.suggestedFilename()).toBe('filled-no-fields.docx')
})

test('keeps templates across reloads', async ({ page }) => {
  await enlist(page)
  await page.reload()
  await expect(page.getByRole('heading', { name: en.workspace.title })).toBeVisible()
  await expect(page.getByText('0 of 3 filled')).toBeVisible()
})
