import { test, expect } from '@playwright/test'
import { enlist, exportDocument, INVOICE_FIELDS } from '../support/e2eHelpers.ts'

test('exports the filled document under the template name', async ({ page }) => {
  await page.goto('/')
  await enlist(page)
  for (const field of INVOICE_FIELDS) {
    await page.getByPlaceholder(field).fill('filled')
  }
  const download = await exportDocument(page)
  expect(download.suggestedFilename()).toBe('filled-invoice-template.docx')
})
