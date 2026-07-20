import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { MedalById } from '../../src/data/Medals.ts'
import { Ranks } from '../../src/data/Ranks.ts'
import { enlist, openServiceRecord } from '../support/e2eHelpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('sets a service record to civilian on the initial app use', async ({ page }) => {
  const modal = await openServiceRecord(page)
  await expect(modal.getByText(Ranks[0].name.en, { exact: true })).toBeVisible()
  await expect(modal.getByText(en.service.record.civilianSubtitle)).toBeVisible()
  await expect(modal.getByText(Ranks[1].name.en, { exact: true }).first()).toBeVisible()
  await expect(modal.getByText(MedalById.mobilization.condition.en).first()).toBeVisible()
  await expect(modal.getByText(en.service.record.civilianLead)).toBeVisible()
})

test('shows the earned decoration and next-rank progress after enlisting', async ({ page }) => {
  await enlist(page)
  const modal = await openServiceRecord(page)
  await expect(modal.getByText(Ranks[1].name.en, { exact: true }).first()).toBeVisible()
  await expect(modal.getByText(Ranks[2].name.en, { exact: true }).first()).toBeVisible()
  await expect(modal.getByText('0 of 3 exports')).toBeVisible()
  await expect(modal.getByText(MedalById.mobilization.quip.en)).toBeVisible()
})
