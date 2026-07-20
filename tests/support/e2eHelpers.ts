import { expect, type Page } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { MedalById } from '../../src/data/Medals.ts'
import { Ranks } from '../../src/data/Ranks.ts'

export const FIXTURES = {
  invoice: 'tests/fixtures/invoice-template.docx',
  offer: 'tests/fixtures/offer-template.docx',
  noFields: 'tests/fixtures/no-fields.docx',
}

export const INVOICE_FIELDS = ['clientName', 'amount', 'dueDate']

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const anyMedalButton = new RegExp(
  en.service.ceremony.medalButtons.map(escapeRegex).join('|'),
)

export const chancelleryOrder = (orderNo: number) =>
  en.service.ceremony.promoEyebrow.replace('{{number}}', String(orderNo).padStart(3, '0'))

export const ceremonyOverlay = (page: Page, hint: string = en.service.ceremony.hint) =>
  page.locator('div.fixed').filter({ hasText: hint })

export const dismissCeremony = async (page: Page, title: string) => {
  await expect(ceremonyOverlay(page).getByText(title, { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
}

export const uploadFirstTemplate = async (page: Page, fixture: string = FIXTURES.invoice) => {
  await page.getByRole('button', { name: en.empty.cta }).click()
  await page.getByLabel(en.upload.choose).setInputFiles(fixture)
  await page.getByRole('button', { name: en.upload.add }).click()
}

export const enlist = async (page: Page, fixture: string = FIXTURES.invoice) => {
  await uploadFirstTemplate(page, fixture)
  await dismissCeremony(page, MedalById.mobilization.name.en)
  await dismissCeremony(page, Ranks[1].name.en)
  await expect(ceremonyOverlay(page)).toHaveCount(0)
}

export const exportDocument = async (page: Page) => {
  const downloadPromise = page.waitForEvent('download')
  await page.locator('main').getByRole('button', { name: en.export.button }).click()
  return downloadPromise
}

export const openServiceRecord = async (page: Page) => {
  await page.getByRole('button', { name: en.service.record.title }).click()
  const modal = page.locator('dialog').filter({ hasText: en.service.record.storageNote })
  await expect(modal).toBeVisible()
  return modal
}
