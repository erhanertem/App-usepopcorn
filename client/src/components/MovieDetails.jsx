import { useEffect, useRef, useState } from 'react';
import { useKey } from '../customHooks/useKey';

import StarRating from './StarRating';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import URL from '../urls.js';

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatchedMovie, watched }) {
  const [movie, setMovie] = useState({});

  function handleAdd() {
    // PREP NEW MOVIE OBJECT
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ')[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };
    // ADD THE NEW MOVIE OBJECT TO THE WATCHED MOVIE LIST
    onAddWatchedMovie(newWatchedMovie);
    // CLOSE THE MOVIE DETAILS MODAL
    onCloseMovie();
  }

  const [userRating, setUserRating] = useState('');
  const [isLoading, setIsLoading] = useState(false); //Loader state
  const [error, setError] = useState(''); //Error message state

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current += 1;
    },
    [userRating]
  );

  // WARNING - DO NOT CONDITIONALLY USE USESTATE HOOK
  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);
  // > SOLUTION VIA STATE UPDATE
  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );
  // // > SOLUTION VIA DERIVED STATE
  // const isTop = imdbRating > 8;
  // console.log(isTop);

  // WE USE GLOBAL ESC KEYDOWN EVENT LISTENER HERE IN THIS COMPONENT BECAUSE WE WANT IT TO GET REMOVED WHEN THE DETAIL VIEW GETS CLOSED
  // useEffect(
  //   function () {
  //     function cb(event) {
  //       if (event.code === 'Escape') {
  //         onCloseMovie();
  //         // console.log('Closing modal');
  //       }
  //     }

  //     document.addEventListener('keydown', cb);
  //     // CLEANUP EVENTLISTENER
  //     return function cleanup() {
  //       document.removeEventListener('keydown', cb);
  //       // console.log('Removing eventlistener');
  //     };
  //   },
  //   [onCloseMovie]
  // );
  // CUSTOM HOOK VERSION
  useKey(onCloseMovie, 'keydown', 'Escape');

  useEffect(
    function () {
      (async function fetchMovieDetails() {
        try {
          // RESET ERROR
          setError('');
          // START LOADER
          setIsLoading(true);
          // Fetch movie details from OMDB API
          const response = await fetch(`${URL}/movies/id/${selectedId}`);
          // GUARD CLAUSE - check for http error
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // console.log(data);
          // GUARD CLAUSE - check for server error
          if (data.Response === 'False') throw new Error('Movie data not found');
          // SET MOVIE DATA to state variable
          setMovie(data);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          // STOP LOADER
          setIsLoading(false);
        }
      })();
    },
    [selectedId]
  );

  useEffect(
    function () {
      title && (document.title = `Movie | ${title}`);

      // CLEANUP FUNCTION
      return function cleanup() {
        document.title = 'usePopcorn';
        // console.log(`Cleanup up effect for movie ${title}`);
      };
    },
    [title]
  );

  // DERIVED STATE
  const isWatched = watched.find((movie) => movie.imdbID === selectedId);
  // console.log(JSON.stringify(isWatched));

  return (
    <div className="details">
      {isLoading && !error && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button
              className="btn-back"
              onClick={onCloseMovie}
            >
              &larr;
            </button>
            <img
              src={poster}
              alt={`Poster of ${title} movie`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAdd}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie ⭐ {isWatched.userRating}</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
