import { test, expect } from '@playwright/test'
import { en } from '../../src/i18n/locales/en.ts'
import { MedalById } from '../../src/data/Medals.ts'
import {
  assignToGroup,
  dismissCeremony,
  enlist,
  FIXTURES,
  groupHeader,
  openGroupChip,
  openTemplateMenu,
  templateMenu,
  tInterpolate,
  uploadTemplateFromMenu,
} from '../support/e2eHelpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('files a template into a new group from the row chip', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await expect(groupHeader(page, 'Contracts')).toBeVisible()
  await expect(groupHeader(page, 'Contracts').getByText('1', { exact: true })).toBeVisible()
  await expect(groupHeader(page, en.templates.groups.ungrouped)).toBeVisible()
})

test('reuses an existing group instead of creating a duplicate', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await openGroupChip(page, 'invoice-template')
  await templateMenu(page).getByRole('button', { name: 'Contracts', exact: true }).click()
  await expect(groupHeader(page, 'Contracts')).toHaveCount(1)
  await expect(groupHeader(page, 'Contracts').getByText('2', { exact: true })).toBeVisible()
  await expect(groupHeader(page, en.templates.groups.ungrouped)).toHaveCount(0)
})

test('removing the last template dissolves the group', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await openGroupChip(page, 'offer-template')
  await templateMenu(page).getByRole('button', { name: en.templates.groups.remove }).click()
  await expect(groupHeader(page, 'Contracts')).toHaveCount(0)
  await expect(groupHeader(page, en.templates.groups.ungrouped)).toHaveCount(0)
})

test('renames a group inline', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await templateMenu(page)
    .getByRole('button', { name: tInterpolate(en.templates.groups.rename, { name: 'Contracts' }) })
    .click()
  const renameInput = templateMenu(page).getByLabel(
    tInterpolate(en.templates.groups.rename, { name: 'Contracts' }),
  )
  await renameInput.fill('Agreements')
  await renameInput.press('Enter')
  await expect(groupHeader(page, 'Agreements')).toBeVisible()
  await expect(groupHeader(page, 'Contracts')).toHaveCount(0)
})

test('collapses and expands a group', async ({ page }) => {
  await enlist(page, FIXTURES.offer)
  await uploadTemplateFromMenu(page, FIXTURES.invoice)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await expect(templateMenu(page).getByText('offer-template')).toBeVisible()
  await groupHeader(page, 'Contracts').click()
  await expect(templateMenu(page).getByText('offer-template')).toHaveCount(0)
  await expect(groupHeader(page, 'Contracts').getByText('1', { exact: true })).toBeVisible()
  await groupHeader(page, 'Contracts').click()
  await expect(templateMenu(page).getByText('offer-template')).toBeVisible()
})

test('assigns a group during upload', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer, 'Contracts')
  await openTemplateMenu(page)
  await expect(groupHeader(page, 'Contracts')).toBeVisible()
  await expect(groupHeader(page, 'Contracts').getByText('1', { exact: true })).toBeVisible()
})

test('keeps groups across reloads', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  await expect(groupHeader(page, 'Contracts')).toBeVisible()
  await page.reload()
  await openTemplateMenu(page)
  await expect(groupHeader(page, 'Contracts')).toBeVisible()
})

test('search filters templates across groups', async ({ page }) => {
  await enlist(page)
  await uploadTemplateFromMenu(page, FIXTURES.noFields)
  await uploadTemplateFromMenu(page, FIXTURES.noFields)
  await uploadTemplateFromMenu(page, FIXTURES.noFields)
  await uploadTemplateFromMenu(page, FIXTURES.invoice)
  await dismissCeremony(page, MedalById['motor-pool'].name.en)
  await uploadTemplateFromMenu(page, FIXTURES.offer)
  await openTemplateMenu(page)
  await assignToGroup(page, 'offer-template', 'Contracts')
  const searchInput = templateMenu(page).getByPlaceholder(
    tInterpolate(en.templates.searchPlaceholder, { count: '6' }),
  )
  await expect(searchInput).toBeVisible()
  await searchInput.fill('offer')
  await expect(templateMenu(page).getByText('offer-template')).toBeVisible()
  await expect(templateMenu(page).getByText('invoice-template')).toHaveCount(0)
  await expect(groupHeader(page, 'Contracts')).toBeVisible()
  await searchInput.fill('does-not-exist')
  await expect(templateMenu(page).getByText(en.templates.searchNoMatch)).toBeVisible()
})
