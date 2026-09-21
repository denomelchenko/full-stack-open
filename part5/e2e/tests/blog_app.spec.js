const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {
  test('the login form is shown by default', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})
