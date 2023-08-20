import { useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find((n) => n.id === id)

  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <Table>
        <tbody>
          {user.blogs.map((blog) => (
            <tr key={blog.id}><td>{blog.title}</td></tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default User
