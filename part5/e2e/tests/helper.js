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

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

module.exports = { resetAndSeed, loginWith }
