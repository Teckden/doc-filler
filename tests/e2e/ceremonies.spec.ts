import { test, expect } from '@playwright/test'
import { MedalById } from '../../src/data/Medals.ts'
import { Ranks } from '../../src/data/Ranks.ts'
import { ceremonyOverlay, uploadFirstTemplate } from '../support/e2eHelpers.ts'

test('auto-dismisses a ceremony after 30 seconds', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await uploadFirstTemplate(page)
  const overlay = ceremonyOverlay(page)
  await expect(overlay.getByText(MedalById.mobilization.name.en, { exact: true })).toBeVisible()
  await page.clock.fastForward('00:31')
  await expect(overlay.getByText(Ranks[1].name.en, { exact: true })).toBeVisible()
  await page.clock.fastForward('00:31')
  await expect(overlay).toHaveCount(0)
})
