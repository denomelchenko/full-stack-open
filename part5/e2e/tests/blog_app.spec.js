const { test, expect } = require('@playwright/test')
const { resetAndSeed, loginWith, createBlog, expandBlog, likeBlog } = require('./helper')

const testUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

const newBlog = {
  title: 'Playwright and the bloglist',
  author: 'Matti Luukkainen',
  url: 'https://example.com/playwright',
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

  test('a logged in user can create a blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await createBlog(page, newBlog)

    await expect(page.locator('.blog', { hasText: newBlog.title })).toBeVisible()
    await expect(page.locator('.blog', { hasText: newBlog.title })).toContainText(newBlog.author)
  })

  test('a blog can be liked', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await createBlog(page, newBlog)

    await expandBlog(page, newBlog.title)
    await likeBlog(page, newBlog.title)

    await expect(
      page.locator('.blog', { hasText: newBlog.title }).first().getByText(/likes:?\s*1/i)
    ).toBeVisible()
  })
})
