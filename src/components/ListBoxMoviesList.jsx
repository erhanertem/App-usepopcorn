import ListBoxMoviesListItem from './ListBoxMoviesListItem';

export default function ListBoxMoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <ListBoxMoviesListItem
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={() => onSelectMovie(movie.imdbID)}
        />
      ))}
    </ul>
  );
}
