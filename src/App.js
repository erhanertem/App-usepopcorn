import { useState } from 'react';

import NavBar from './components/NavBar';
import Main from './components/Main';
import NavLogo from './components/NavLogo';
import Loader from './components/Loader';
import NavSearch from './components/NavSearch';
import ErrorMessage from './components/ErrorMessage';
import NavNumResults from './components/NavNumResults';
import ListBoxMoviesList from './components/ListBoxMoviesList';
import Box from './components/Box';
import WatchedBoxSummary from './components/WatchedBoxSummary';
import WatchedBoxMoviesList from './components/WatchedBoxMoviesList';
import MovieDetails from './components/MovieDetails';
import { useMovies } from './customHooks/useMovies';
import { useLocalStorageState } from './customHooks/useLocalStorageState';

export default function App() {
  // CUSTOM HOOK FOR WATCHED MOVIE LIST & LOCALSTORAGE LOGIC ABSTRACTION
  const [watched, setWatched] = useLocalStorageState([], 'watched');
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem('watched');
  //   return JSON.parse(storedValue);
  // });
  // // WRITE OFF TO LOCALSTORAGE WHENEVER WACTHED MOVIES LIST STATE CHANGES
  // useEffect(
  //   function () {
  //     localStorage.setItem('watched', JSON.stringify(watched));
  //   },
  //   [watched]
  // );
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // // WRITE OFF TO LOCALSTORAGE
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }
  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  const { movies, isLoading, error } = useMovies(query, setSelectedId);

  /*
    useEffect(function () {
    console.log('A');
  }, []);
  useEffect(
    function () {
      console.log('E');
    },
    [query]
  );
  useEffect(function () {
    console.log('B');
  });
  useLayoutEffect(function () {
    console.log('C');
  }, []);
  console.log('D');
  */

  return (
    <>
      <NavBar style={{ color: 'red' }}>
        <NavLogo />
        <NavSearch
          query={query}
          setQuery={setQuery}
        />
        <NavNumResults movies={movies} />
      </NavBar>
      <Main>
        {/* Explicit named Prop Component Composition */}
        {/* <Box element={<ListBoxMoviesList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedBoxSummary watched={watched} />
              <WatchedBoxMoviesList watched={watched} />
            </>
          }
        /> */}

        {/* Implicit Children Prop Component Composition */}
        <Box>
          {!isLoading && !error && (
            <ListBoxMoviesList
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}
          {isLoading && !error && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedBoxSummary watched={watched} />
              <WatchedBoxMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
          {/* {error && (
            <ErrorMessage
              message={error}
            />
          )} */}
        </Box>
      </Main>
    </>
  );
}
