const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentPost) => {
    return accumulator + currentPost.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((maxBlog, currentBlog) => {
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog
  })
  function omitirPropiedades(key, value) {
    if (key === '_id' || key === '__v' || key === 'url') {
      return undefined // Omitir la propiedad
    }
    return value
  }
  return JSON.parse(JSON.stringify(favoriteBlog, omitirPropiedades))


}

const mostBlogs = (blogs) => {
  const authorCount = blogs.reduce((count, post) => {
    count[post.author] = (count[post.author] || 0) + 1
    return count
  }, {})

  let maxAuthor = ''
  let maxCount = 0

  for (const author in authorCount) {
    if (authorCount[author] > maxCount) {
      maxAuthor = author
      maxCount = authorCount[author]
    }
  }

  const result = {
    'author': maxAuthor,
    'blogs': maxCount
  }
  return result
}

const mostLikes = (blogs) => {
  const likesPorAutor = blogs.reduce((likes, post) => {
    const author = post.author
    likes[author] = (likes[author] || 0) + post.likes
    return likes
  }, {})

  let likesAuthor = ''
  let maxLikes = 0

  for (const autor in likesPorAutor) {
    if (likesPorAutor[autor] > maxLikes) {
      likesAuthor = autor
      maxLikes = likesPorAutor[autor]
    }
  }

  const result = { 'author': likesAuthor, 'likes': maxLikes }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}