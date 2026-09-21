// Empties the test database through POST /api/testing/reset and then creates
// the given user through POST /api/users. Both requests go through the Vite
// dev server (baseURL http://localhost:5173), which proxies /api to the
// backend on http://localhost:3003.
const resetAndSeed = async (request, user) => {
  const resetResponse = await request.post('/api/testing/reset')

  if (!resetResponse.ok()) {
    throw new Error('resetting the database failed with status ' + resetResponse.status())
  }

  const createResponse = await request.post('/api/users', { data: user })

  if (!createResponse.ok()) {
    throw new Error('creating the test user failed with status ' + createResponse.status())
  }

  return createResponse.json()
}

// Creates one more user without touching the blogs that already exist.
const createUser = async (request, user) => {
  const response = await request.post('/api/users', { data: user })

  if (!response.ok()) {
    throw new Error('creating a user failed with status ' + response.status())
  }

  return response.json()
}

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

// Opens the create-blog form (exercise 5.5), fills the three fields in their
// DOM order (title, author, url - exercise 5.6), submits, and then WAITS until
// the new blog is rendered. The wait is the fix for the lost-item flake.
const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: /create new blog|new blog/i }).click()

  const form = page.locator('form')
  await form.getByRole('textbox').nth(0).fill(title)
  await form.getByRole('textbox').nth(1).fill(author)
  await form.getByRole('textbox').nth(2).fill(url)
  await form.getByRole('button', { name: /create|save|add/i }).click()

  await page.locator('.blog', { hasText: title }).first().waitFor()
}

// The details of a blog are hidden behind the exercise 5.7 toggle. The regex
// accepts "view"/"details" (collapsed) and "hide" (expanded).
const expandBlog = async (page, title) => {
  await page
    .locator('.blog', { hasText: title })
    .first()
    .getByRole('button', { name: /view|details|hide/i })
    .click()
}

const likeBlog = async (page, title) => {
  await page.locator('.blog', { hasText: title }).first().getByRole('button', { name: 'like' }).click()
}

module.exports = { resetAndSeed, createUser, loginWith, logout, createBlog, expandBlog, likeBlog }
