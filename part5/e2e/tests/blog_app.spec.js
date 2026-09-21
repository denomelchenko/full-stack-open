const { test, expect } = require('@playwright/test')
const { resetAndSeed, loginWith } = require('./helper')

const testUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndSeed(request, testUser)
    await page.goto('/')
  })

  test('the login form is shown by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login succeeds with the correct credentials', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toHaveCount(0)
  })

  test('login fails with the wrong credentials', async ({ page }) => {
    await loginWith(page, testUser.username, 'wrong-password')

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).toHaveCount(0)
    await expect(page.getByText(/wrong|invalid/i)).toBeVisible()
  })
})
