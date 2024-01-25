import { useCallback, useState } from 'react';
import { useMovies } from './useMovies';
import {
	Box,
	Main,
	MovieDetails,
	MovieList,
	WatchedMovieList,
	WatchedMovieListSummary,
} from './Main';
import { NavBar, NumResults, SearchBar } from './NavBar';
import { Loader } from './Loader';
import { useLocalStorageState } from './useLocalStorageState';

export const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState('');

	const [selectedId, setSelectedId] = useState(null);
	function handleSelectMovie(id) {
		// // Plain setter
		// setSelectedId(id);
		// Selector setup - if clicked again on itself, gets deselected
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	const handleCloseMovie = useCallback(() => setSelectedId(null), []);
	// function handleCloseMovie() {
	// 	setSelectedId(null);
	// }

	const { movies, isLoading, error, APIKEY } = useMovies(query, handleCloseMovie);

	// const [watched, setWatched] = useState([]);
	// const [watched, setWatched] = useState(() => {
	// 	const storedValue = localStorage.getItem('watched');
	// 	return JSON.parse(storedValue) || [];
	// });
	const [watched, setWatched] = useLocalStorageState([], 'watched');

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);

		// MANUALLY HANDLING LOCALSTORAGE - INSTEAD WE USED USEEFFECT TO BE TRIGGERED EACH TIME WATCHED GETS UPDATED
		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	}
	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	// useEffect(
	// 	function () {
	// 		localStorage.setItem('watched', JSON.stringify(watched));
	// 	},
	// 	[watched],
	// );

	// //> ASYNC VERSION
	// useEffect(
	// 	function () {
	// 		const controller = new AbortController(); //Controls fetching via signal property
	// 		const signal = controller.signal;

	// 		//API FETCH
	// 		async function fetchMovies() {
	// 			try {
	// 				// Start loader
	// 				setIsLoading(true);
	// 				// Reset Error status
	// 				setError('');

	// 				const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`, {
	// 					signal,
	// 				});

	// 				// console.log(res);
	// 				if (!res.ok) throw new Error('Something went wrong with fetching movies');

	// 				const data = await res.json();

	// 				// console.log(data);
	// 				if (data.Response === 'False') throw new Error('Movie not found');

	// 				// Render results
	// 				// console.log(data.Search);
	// 				setMovies(data.Search);
	// 				setError('');
	// 			} catch (err) {
	// 				if (err.name !== 'AbortError') {
	// 					console.log(err);
	// 					setError(err.message); // Deploy erro message on UI
	// 				}
	// 			} finally {
	// 				// Stop loader
	// 				setIsLoading(false);
	// 			}
	// 		}

	// 		// If query statement is absent/not certain length, do not bother to initiate fetching algorithm
	// 		if (query.length < 3) {
	// 			setMovies([]);
	// 			setError('');
	// 			return;
	// 		}

	// 		handleCloseMovie();
	// 		fetchMovies();

	// 		return function () {
	// 			controller.abort();
	// 		};
	// 	},
	// 	[query],
	// );

	//> SYNC VERSION
	// useEffect(function () {
	// 	setIsLoading(true);
	// 	fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`)
	// 		.then((res) => res.json())
	// 		.then((data) => setMovies(data.Search));
	// 	setIsLoading(false);
	// }, []);

	return (
		<>
			<NavBar>
				<SearchBar query={query} setQuery={setQuery} setSelectedId={setSelectedId} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				{/* EXPLICIT COMPOSITION */}
				{/* <Box element={<MovieList movies={movies} />} />
				<Box
					element={
						<>
							<WatchedMovieListSummary watched={watched} />
							<WatchedMovieList watched={watched} />
						</>
					}
				/> */}
				{/* IMPLICIT COMPOSITION */}
				<Box>
					{/* Conditional UI loading */}
					{isLoading && <Loader />}
					{!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
					{error && <ErrorMessage error={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
							apiKey={APIKEY}
							key={selectedId}
						/>
					) : (
						<>
							<WatchedMovieListSummary watched={watched} />
							<WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function ErrorMessage({ error }) {
	return (
		<p className="error">
			<span>⛔</span>
			{error}
		</p>
	);
}
