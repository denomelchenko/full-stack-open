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

// The login form lives on /login, reachable from the navigation bar.
const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByRole('textbox').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

// The create form lives on /blogs/new, reachable from the navigation bar. The
// final wait is the fix for the lost-item flake: the form empties before the
// server has answered and App then navigates back to the list.
const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('link', { name: 'new blog' }).click()

  const form = page.locator('form')
  await form.getByRole('textbox').nth(0).fill(title)
  await form.getByRole('textbox').nth(1).fill(author)
  await form.getByRole('textbox').nth(2).fill(url)
  await form.getByRole('button', { name: /create|save|add/i }).click()

  await page.locator('.blog', { hasText: title }).first().waitFor()
}

// The list item is a link (<title> <author>) to /blogs/:id.
const openBlog = async (page, title) => {
  await page.locator('.blog', { hasText: title }).first().getByRole('link').click()
}

module.exports = { resetAndSeed, createUser, loginWith, logout, createBlog, openBlog }
