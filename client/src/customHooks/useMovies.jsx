import { useEffect, useState } from 'react';

import URL from '../urls.js';

export function useMovies(query, setSelectedId) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false); //Loader state
  const [error, setError] = useState(''); //Error message state

  useEffect(
    function () {
      // ABORTCONTROLLER BROWSER API
      const controller = new AbortController();

      // // -> .THEN FETCH HANDLING
      // setIsLoading(true);
      // fetch(
      //   `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_APIKEY}&s=interstellar`
      // )
      //   .then((res) => res.json())
      //   .then((data) => setMovies(data.Search))
      //   .finally(setIsLoading(false));
      // -> ASYNC/AWAIT FETCH HANDLING
      (async function fetchMovies() {
        // GUARD CLAUSE - no input no error
        if (query.length < 3) {
          // RESET selectedId
          setSelectedId(null);
          // RESET SEARCH RESULTS
          setMovies([]);
          // RESET ERROR
          setError('');
          return;
        }

        try {
          // RESET ERROR
          setError('');
          // START LOADER
          setIsLoading(true);
          // MAKE API CALL TO OMDB API
          const response = await fetch(`${URL}/movies/${query}`, {
            signal: controller.signal, //Abort controller signal object
          });
          // GUARD CLAUSE - server connection interruoted error
          if (!response.ok) throw new Error('Something went wrong with fetching movies');
          const data = await response.json();
          // GUARD CLAUSE - server response error
          // console.log(data);
          if (data.Response === 'False') throw new Error(data.Error);

          setMovies(data.Search);
        } catch (err) {
          // console.log(err.message);
          // Ignore AbortController error
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          // STOP LOADER
          setIsLoading(false);
        }
      })();

      return function cleanup() {
        controller.abort(); //Abort fetch request
      };
    },
    [query, setSelectedId]
  );

  return { movies, isLoading, error };
}
