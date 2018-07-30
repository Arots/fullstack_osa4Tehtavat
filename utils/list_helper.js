const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const ammount = (sum, blog) => sum + blog.likes;

    return blogs.length ? blogs.reduce(ammount, 0) : 0
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.map(blog => blog.likes)
    const mostLikesObject = blogs.find(blog => 
        blog.likes === Math.max(...favorite))


    return mostLikesObject
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}