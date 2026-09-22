const errorHandler = (error, request, response, next) => {
  // Express identifies an error handler by its four parameters, so the fourth
  // parameter must exist even though it is not used directly here.
  // eslint-disable-next-line no-unused-vars
  const ignored = next

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformed id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return response.status(500).json({ error: 'something went wrong' })
}

module.exports = errorHandler
