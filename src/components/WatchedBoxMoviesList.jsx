import WatchedBoxMoviesListItem from './WatchedBoxMoviesListItem';

export default function WatchedBoxMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedBoxMoviesListItem
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
