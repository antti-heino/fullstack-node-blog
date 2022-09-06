const dummy = (blogs) => {
    return 1
  }
const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => (total += blog.likes), 0)
  }

const favoriteBlog = (blogs) => {
    return blogs.reduce((blog1, blog2) => blog1.likes >= blog2.likes ? blog1 : blog2)

}
  
  module.exports = {
    dummy, totalLikes, favoriteBlog
  }