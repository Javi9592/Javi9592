import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries';

const Recommend = ({ show, favorite }) => {

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: favorite }
  });

  if (!show) {
    return null
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading recommendations</div>;
  }

  const recommendedBooks = data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favorite}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            (a.genres.includes(favorite)) && (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
