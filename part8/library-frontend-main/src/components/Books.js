import { useState, useEffect } from 'react';

const Books = ({ show, books }) => {
  const [allGenres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const genresArray = [];
    books.forEach(book => {
      genresArray.push(...book.genres);
    });
    const uniqueGenres = [...new Set(genresArray)];
    setGenres(uniqueGenres);
  }, [books]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            (selectedGenre === null || a.genres.includes(selectedGenre)) && (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      {allGenres.map(genre => (
        <button
          key={genre}
          onClick={() => handleGenreChange(genre)}
          className={selectedGenre === genre ? 'active' : ''}
        >
          {genre}
        </button>
      ))}
      <button
        onClick={() => setSelectedGenre(null)}
        className={selectedGenre === null ? 'active' : ''}
      >
        all genres
      </button>
    </div>
  );
};

export default Books;