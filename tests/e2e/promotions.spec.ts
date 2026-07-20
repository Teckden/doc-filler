import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { MedalById } from '../../src/data/Medals.ts'
import { Ranks } from '../../src/data/Ranks.ts'
import {
  anyMedalButton,
  ceremonyOverlay,
  chancelleryOrder,
  enlist,
  exportDocument,
  openServiceRecord,
  uploadFirstTemplate,
} from '../support/e2eHelpers.ts'

test('awards Mobilization and promotes to Recruit on the first upload', async ({ page }) => {
  await page.goto('/')
  await uploadFirstTemplate(page)
  const overlay = ceremonyOverlay(page)
  await expect(overlay.getByText(en.service.ceremony.medalEyebrow)).toBeVisible()
  await expect(overlay.getByText(MedalById.mobilization.name.en, { exact: true })).toBeVisible()
  await expect(overlay.getByText(MedalById.mobilization.quip.en)).toBeVisible()
  await overlay.getByRole('button', { name: anyMedalButton }).click()

  await expect(overlay.getByText(chancelleryOrder(1))).toBeVisible()
  await expect(overlay.getByText(Ranks[1].name.en, { exact: true })).toBeVisible()
  await overlay.getByRole('button', { name: en.service.ceremony.promoButton }).click()
  await expect(overlay).toHaveCount(0)
})

test('counts one export per minute toward promotion', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await enlist(page)
  await exportDocument(page)
  await exportDocument(page)
  let modal = await openServiceRecord(page)
  await expect(modal.getByText('1 of 3 exports')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()

  await page.clock.fastForward('01:01')
  await exportDocument(page)
  modal = await openServiceRecord(page)
  await expect(modal.getByText('2 of 3 exports')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()

  await page.clock.fastForward('01:01')
  await exportDocument(page)
  const overlay = ceremonyOverlay(page)
  await expect(overlay.getByText(chancelleryOrder(2))).toBeVisible()
  await expect(overlay.getByText(Ranks[2].name.en, { exact: true })).toBeVisible()
})
