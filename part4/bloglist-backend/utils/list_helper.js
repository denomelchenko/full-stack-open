const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}

  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let topCount = 0

  Object.keys(counts).forEach((author) => {
    if (counts[author] > topCount) {
      topAuthor = author
      topCount = counts[author]
    }
  })

  return {
    author: topAuthor,
    blogs: topCount,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesPerAuthor = {}

  blogs.forEach((blog) => {
    likesPerAuthor[blog.author] = (likesPerAuthor[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let topLikes = -1

  Object.keys(likesPerAuthor).forEach((author) => {
    if (likesPerAuthor[author] > topLikes) {
      topAuthor = author
      topLikes = likesPerAuthor[author]
    }
  })

  return {
    author: topAuthor,
    likes: topLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
