import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { uk } from '../../src/i18n/locales/uk.ts'
import { MedalById } from '../../src/data/Medals.ts'
import {
  ceremonyOverlay,
  dismissCeremony,
  enlist,
  exportDocument,
  INVOICE_FIELDS,
  openServiceRecord,
} from '../support/e2eHelpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await enlist(page)
})

test('awards Direct Hit for an export with every field filled', async ({ page }) => {
  for (const field of INVOICE_FIELDS) {
    await page.getByPlaceholder(field).fill('filled')
  }
  await exportDocument(page)
  await dismissCeremony(page, MedalById['direct-hit'].name.en)
  await expect(ceremonyOverlay(page)).toHaveCount(0)
})

test('records an incomplete export without decorations', async ({ page }) => {
  await page.getByPlaceholder('clientName').fill('draft only')
  await exportDocument(page)
  const modal = await openServiceRecord(page)
  await expect(modal.getByText('1 of 3 exports')).toBeVisible()
  await expect(ceremonyOverlay(page)).toHaveCount(0)
})

test('awards Night Ops for a dark-theme export', async ({ page }) => {
  await page.getByRole('button', { name: en.theme.dark }).click()
  await exportDocument(page)
  await dismissCeremony(page, MedalById['night-ops'].name.en)
  await expect(ceremonyOverlay(page)).toHaveCount(0)
})

test('awards Interpreter for switching the language', async ({ page }) => {
  await page.getByRole('button', { name: en.language.label }).click()
  await page.getByRole('button', { name: 'Українська' }).click()
  const overlay = ceremonyOverlay(page, uk.service.ceremony.hint)
  await expect(overlay.getByText(MedalById.interpreter.name.uk, { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(overlay).toHaveCount(0)
})

test('awards Scorched Earth for clearing all fields', async ({ page }) => {
  await page.getByPlaceholder('clientName').fill('draft')
  await page.getByRole('button', { name: en.clear.button }).click()
  await page.getByRole('button', { name: en.clear.confirm }).click()
  await dismissCeremony(page, MedalById['scorched-earth'].name.en)
  await expect(ceremonyOverlay(page)).toHaveCount(0)
})
