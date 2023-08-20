import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {


  const style = {
    marginBottom: 2,
    padding: 5,
    borderStyle: 'solid',
  }

  return (
    <td style={style} className='blog'>
      <Link to={`/blogs/${blog.id}`} className='no-underline' >
        {blog.title} {blog.author}
      </Link>
    </td>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
  }),
}

export default Blog
