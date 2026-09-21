const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

module.exports = { loginWith }
