import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { uk } from '../../src/i18n/locales/uk.ts'

test('switches the interface language', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(en.empty.title)).toBeVisible()
  await page.getByRole('button', { name: en.language.label }).click()
  await page.getByRole('button', { name: 'Українська' }).click()
  await expect(page.getByText(uk.empty.title)).toBeVisible()
})
