const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => {
    return blog.likes < fav.likes ? fav : blog
  }, {})
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorCountsObj = _.countBy(blogs, (blog) => blog.author)
  const authorCountsAry = Object.keys(authorCountsObj).map(key => {
    return {
      author: key,
      blogs: authorCountsObj[key]
    }
  });

  const maxAuthor = _.maxBy(authorCountsAry, o => o.author)
  return maxAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorCountsObj = _.countBy(blogs, (blog) => blog.author)
  const authorCountsAry = Object.keys(authorCountsObj).map(key => {
    return {
      author: key,
      blogs: authorCountsObj[key]
    }
  });
  
  const maxAuthor = _.maxBy(authorCountsAry, o => o.author)
  return maxAuthor
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
  favoriteBlog
}