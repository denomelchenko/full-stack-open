const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
  })

  test('dummy returns one for a non-empty list', () => {
    assert.strictEqual(listHelper.dummy([{ title: 'anything' }]), 1)
  })
})
