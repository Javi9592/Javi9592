import Blog from './Blog'

const Blogs = ({ blogs, user, editBlog, deleteBlog }) => {
  function compareLikes(objectA, objectB) {
    return objectB.likes - objectA.likes
  }
  return(
    <>
      {blogs.sort(compareLikes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} editBlog={editBlog} deleteBlog={deleteBlog} />
      )}
    </>
  )
}

export default Blogs