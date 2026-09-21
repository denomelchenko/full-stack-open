const { test, expect } = require('@playwright/test')
const { resetAndSeed, loginWith, createBlog, openBlog } = require('./helper')

const testUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

const newBlog = {
  title: 'Playwright and the routed bloglist',
  author: 'Matti Luukkainen',
  url: 'https://example.com/playwright',
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndSeed(request, testUser)
    await page.goto('/')
  })

  test('login succeeds with the correct credentials', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toHaveCount(0)
    await expect(page).toHaveURL('/')
  })

  test('login fails with the wrong credentials', async ({ page }) => {
    await loginWith(page, testUser.username, 'wrong-password')

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).toHaveCount(0)
    await expect(page.getByText(/wrong|invalid/i)).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('a logged in user can create a blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await createBlog(page, newBlog)

    await expect(page).toHaveURL('/')
    await expect(page.locator('.blog', { hasText: newBlog.title })).toBeVisible()
  })

  test('a logged in user can like a blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await createBlog(page, newBlog)

    await openBlog(page, newBlog.title)
    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText(/likes:?\s*1/i)).toBeVisible()
  })

  test('a logged in user can delete a blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await createBlog(page, newBlog)

    await openBlog(page, newBlog.title)

    // window.confirm blocks the page: Playwright only continues once the
    // dialog is handled. Register the handler BEFORE clicking delete.
    page.on('dialog', (dialog) => dialog.accept())

    await page.getByRole('button', { name: 'delete' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.locator('.blog', { hasText: newBlog.title })).toHaveCount(0)
  })
})
